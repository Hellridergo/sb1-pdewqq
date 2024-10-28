import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';

export class LoginViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';

    constructor() {
        super();
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    async onLogin() {
        try {
            await AuthService.signInWithEmail(this.email, this.password);
            navigate('pages/home/home-page');
        } catch (error) {
            console.error('Login error:', error);
            // Show error dialog
        }
    }

    async onGoogleLogin() {
        try {
            await AuthService.signInWithGoogle();
            navigate('pages/home/home-page');
        } catch (error) {
            console.error('Google login error:', error);
            // Show error dialog
        }
    }

    onRegisterTap() {
        navigate('pages/auth/register-page');
    }

    onForgotPassword() {
        navigate('pages/auth/forgot-password-page');
    }
}