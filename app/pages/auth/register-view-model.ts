import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';
import { UserService } from '../../services/user.service';

export class RegisterViewModel extends Observable {
    private _fullName: string = '';
    private _email: string = '';
    private _password: string = '';
    private _confirmPassword: string = '';

    constructor() {
        super();
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

    get password(): string { return this._password; }
    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    get confirmPassword(): string { return this._confirmPassword; }
    set confirmPassword(value: string) {
        if (this._confirmPassword !== value) {
            this._confirmPassword = value;
            this.notifyPropertyChange('confirmPassword', value);
        }
    }

    async onRegister() {
        if (this.password !== this.confirmPassword) {
            // Show error dialog
            return;
        }

        try {
            const userCredential = await AuthService.register(this.email, this.password);
            await UserService.createUserProfile({
                uid: userCredential.user.uid,
                fullName: this.fullName,
                email: this.email
            });
            navigate('pages/home/home-page');
        } catch (error) {
            console.error('Registration error:', error);
            // Show error dialog
        }
    }
}