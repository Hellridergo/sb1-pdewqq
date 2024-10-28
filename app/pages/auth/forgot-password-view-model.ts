import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';

export class ForgotPasswordViewModel extends Observable {
    private _email: string = '';

    constructor() {
        super();
    }

    get email(): string { return this._email; }
    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    async onResetPassword() {
        try {
            await AuthService.resetPassword(this.email);
            // Show success dialog
            navigate('pages/auth/login-page');
        } catch (error) {
            console.error('Password reset error:', error);
            // Show error dialog
        }
    }
}