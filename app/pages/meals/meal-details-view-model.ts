import { Observable } from '@nativescript/core';
import { MealService, Meal } from '../../services/meal.service';
import { navigate } from '../../utils/navigation';

export class MealDetailsViewModel extends Observable {
    private _meal: Meal | null = null;

    constructor(private mealId: string) {
        super();
        this.loadMeal();
    }

    get meal(): Meal | null { return this._meal; }
    set meal(value: Meal | null) {
        if (this._meal !== value) {
            this._meal = value;
            this.notifyPropertyChange('meal', value);
        }
    }

    private async loadMeal() {
        try {
            this.meal = await MealService.getMealById(this.mealId);
        } catch (error) {
            console.error('Error loading meal:', error);
            // Show error dialog
        }
    }

    async onDeleteMeal() {
        try {
            await MealService.deleteMeal(this.mealId);
            navigate('pages/home/home-page');
        } catch (error) {
            console.error('Error deleting meal:', error);
            // Show error dialog
        }
    }
}