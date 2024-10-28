import { Observable } from '@nativescript/core';
import { UserService } from '../../services/user.service';
import { MealService } from '../../services/meal.service';
import { navigate } from '../../utils/navigation';
import { auth } from '../../services/firebase.service';

export class HomeViewModel extends Observable {
    private _dailyCalories: number = 0;
    private _remainingCalories: number = 2000;
    private _todaysMeals: any[] = [];

    constructor() {
        super();
        this.loadUserData();
        this.loadTodaysMeals();
    }

    get dailyCalories(): number { return this._dailyCalories; }
    set dailyCalories(value: number) {
        if (this._dailyCalories !== value) {
            this._dailyCalories = value;
            this.notifyPropertyChange('dailyCalories', value);
        }
    }

    get remainingCalories(): number { return this._remainingCalories; }
    set remainingCalories(value: number) {
        if (this._remainingCalories !== value) {
            this._remainingCalories = value;
            this.notifyPropertyChange('remainingCalories', value);
        }
    }

    get todaysMeals(): any[] { return this._todaysMeals; }
    set todaysMeals(value: any[]) {
        if (this._todaysMeals !== value) {
            this._todaysMeals = value;
            this.notifyPropertyChange('todaysMeals', value);
        }
    }

    async loadUserData() {
        try {
            const user = auth().currentUser;
            if (user) {
                const profile = await UserService.getUserProfile(user.uid);
                this.remainingCalories = profile.dailyCalorieGoal || 2000;
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async loadTodaysMeals() {
        try {
            const user = auth().currentUser;
            if (user) {
                const meals = await MealService.getTodaysMeals(user.uid);
                this.todaysMeals = meals;
                this.calculateDailyCalories();
            }
        } catch (error) {
            console.error('Error loading meals:', error);
        }
    }

    private calculateDailyCalories() {
        const total = this.todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
        this.dailyCalories = total;
        this.remainingCalories = (this.remainingCalories - total);
    }

    onAddMeal() {
        navigate('pages/meals/add-meal-page');
    }

    onSettings() {
        navigate('pages/settings/settings-page');
    }
}