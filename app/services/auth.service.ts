import { auth } from './firebase.service';
import { GoogleSignIn } from '@nativescript/google-signin';

export class AuthService {
  static async signInWithGoogle() {
    try {
      const user = await GoogleSignIn.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        user.idToken
      );
      return auth.signInWithCredential(credential);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  static async signInWithEmail(email: string, password: string) {
    try {
      return await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Email Sign-In Error:', error);
      throw error;
    }
  }

  static async register(email: string, password: string) {
    try {
      return await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }

  static async resetPassword(email: string) {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Password Reset Error:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  }
}