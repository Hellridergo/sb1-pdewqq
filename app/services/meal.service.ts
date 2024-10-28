import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';

const firestore = firebase().firestore();

export interface Meal {
    id?: string;
    userId: string;
    name: string;
    calories: number;
    imageUrl?: string;
    timestamp: Date;
    foods: Array<{
        name: string;
        calories: number;
        portion: string;
    }>;
}

export class MealService {
    static async addMeal(meal: Meal): Promise<string> {
        try {
            const docRef = await firestore.collection('meals').add(meal);
            return docRef.id;
        } catch (error) {
            console.error('Error adding meal:', error);
            throw error;
        }
    }

    static async getMealById(id: string): Promise<Meal> {
        try {
            const doc = await firestore.collection('meals').doc(id).get();
            return { id: doc.id, ...doc.data() } as Meal;
        } catch (error) {
            console.error('Error getting meal:', error);
            throw error;
        }
    }

    static async deleteMeal(id: string): Promise<void> {
        try {
            await firestore.collection('meals').doc(id).delete();
        } catch (error) {
            console.error('Error deleting meal:', error);
            throw error;
        }
    }

    static async getTodaysMeals(userId: string): Promise<Meal[]> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const snapshot = await firestore
                .collection('meals')
                .where('userId', '==', userId)
                .where('timestamp', '>=', today)
                .orderBy('timestamp', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Meal));
        } catch (error) {
            console.error('Error getting meals:', error);
            throw error;
        }
    }

    static async getMealsByDateRange(userId: string, start: Date, end: Date): Promise<Meal[]> {
        try {
            const snapshot = await firestore
                .collection('meals')
                .where('userId', '==', userId)
                .where('timestamp', '>=', start)
                .where('timestamp', '<=', end)
                .orderBy('timestamp', 'asc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Meal));
        } catch (error) {
            console.error('Error getting meals by date range:', error);
            throw error;
        }
    }
}