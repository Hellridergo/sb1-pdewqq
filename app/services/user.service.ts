import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';

const firestore = firebase().firestore();

export interface UserProfile {
    uid: string;
    fullName: string;
    email: string;
    dailyCalorieGoal?: number;
    preferredUnits?: 'metric' | 'imperial';
}

export class UserService {
    static async createUserProfile(profile: UserProfile) {
        try {
            await firestore.collection('users').doc(profile.uid).set(profile);
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    static async getUserProfile(uid: string): Promise<UserProfile> {
        try {
            const doc = await firestore.collection('users').doc(uid).get();
            return doc.data() as UserProfile;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    }

    static async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
        try {
            await firestore.collection('users').doc(uid).update(updates);
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }
}