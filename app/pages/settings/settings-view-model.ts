import { Observable } from '@nativescript/core';
import { UserService, UserProfile } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';
import { auth } from '../../services/firebase.service';

export class SettingsViewModel extends Observable {
    private _fullName: string = '';
    private _email: string = '';
    private _dailyCalorieGoal: string = '';
    private _selectedUnitIndex: number = 0;
    private _userProfile: UserProfile | null = null;

    constructor() {
        super();
        this.loadUserProfile();
    }

    get fullName(): string { return this._fullName; }
    set fullName(value: string) {
        if (this._fullName !== value) {
            this._fullName = value;
            this.notifyPropertyChange('fullName', value);
        }
    }

    get email(): string { return this._email; }
    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get dailyCalorieGoal(): string { return this._dailyCalorieGoal; }
    set dailyCalorieGoal(value: string) {
        if (this._dailyCalorieGoal !== value) {
            this._dailyCalorieGoal = value;
            this.notifyPropertyChange('dailyCalorieGoal', value);
            this.saveUserProfile();
        }
    }

    get selectedUnitIndex(): number { return this._selectedUnitIndex; }
    set selectedUnitIndex(value: number) {
        if (this._selectedUnitIndex !== value) {
            this._selectedUnitIndex = value;
            this.notifyPropertyChange('selectedUnitIndex', value);
            this.saveUserProfile();
        }
    }

    private async loadUserProfile() {
        try {
            const user = auth().currentUser;
            if (user) {
                this._userProfile = await UserService.getUserProfile(user.uid);
                this.fullName = this._userProfile.fullName;
                this.email = this._userProfile.email;
                this.dailyCalorieGoal = (this._userProfile.dailyCalorieGoal || 2000).toString();
                this.selectedUnitIndex = this._userProfile.preferredUnits === 'imperial' ? 1 : 0;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    private async saveUserProfile() {
        try {
            const user = auth().currentUser;
            if (user && this._userProfile) {
                await UserService.updateUserProfile(user.uid, {
                    fullName: this.fullName,
                    dailyCalorieGoal: parseInt(this.dailyCalorieGoal),
                    preferredUnits: this.selectedUnitIndex === 1 ? 'imperial' : 'metric'
                });
            }
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    }

    async onChangePassword() {
        if (this.email) {
            await AuthService.resetPassword(this.email);
            // Show success dialog
        }
    }

    async onSignOut() {
        try {
            await AuthService.signOut();
            navigate('pages/auth/login-page');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }
}