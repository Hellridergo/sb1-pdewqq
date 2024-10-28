import { Observable } from '@nativescript/core';
import { MealService } from '../../services/meal.service';
import { UserService } from '../../services/user.service';
import { auth } from '../../services/firebase.service';

export class StatisticsViewModel extends Observable {
    private _selectedRangeIndex: number = 0;
    private _chartHtml: string = '';
    private _averageCalories: number = 0;
    private _totalMeals: number = 0;
    private _highestDay: number = 0;
    private _goalAchievement: number = 0;
    private _commonFoods: Array<{name: string, count: number}> = [];

    constructor() {
        super();
        this.loadStatistics();
    }

    get selectedRangeIndex(): number { return this._selectedRangeIndex; }
    set selectedRangeIndex(value: number) {
        if (this._selectedRangeIndex !== value) {
            this._selectedRangeIndex = value;
            this.notifyPropertyChange('selectedRangeIndex', value);
            this.loadStatistics();
        }
    }

    get chartHtml(): string { return this._chartHtml; }
    set chartHtml(value: string) {
        if (this._chartHtml !== value) {
            this._chartHtml = value;
            this.notifyPropertyChange('chartHtml', value);
        }
    }

    get averageCalories(): number { return this._averageCalories; }
    set averageCalories(value: number) {
        if (this._averageCalories !== value) {
            this._averageCalories = value;
            this.notifyPropertyChange('averageCalories', value);
        }
    }

    get totalMeals(): number { return this._totalMeals; }
    set totalMeals(value: number) {
        if (this._totalMeals !== value) {
            this._totalMeals = value;
            this.notifyPropertyChange('totalMeals', value);
        }
    }

    get highestDay(): number { return this._highestDay; }
    set highestDay(value: number) {
        if (this._highestDay !== value) {
            this._highestDay = value;
            this.notifyPropertyChange('highestDay', value);
        }
    }

    get goalAchievement(): number { return this._goalAchievement; }
    set goalAchievement(value: number) {
        if (this._goalAchievement !== value) {
            this._goalAchievement = value;
            this.notifyPropertyChange('goalAchievement', value);
        }
    }

    get commonFoods(): Array<{name: string, count: number}> { return this._commonFoods; }
    set commonFoods(value: Array<{name: string, count: number}>) {
        if (this._commonFoods !== value) {
            this._commonFoods = value;
            this.notifyPropertyChange('commonFoods', value);
        }
    }

    private async loadStatistics() {
        try {
            const user = auth().currentUser;
            if (!user) return;

            const range = this.getDateRange();
            const meals = await MealService.getMealsByDateRange(user.uid, range.start, range.end);
            const userProfile = await UserService.getUserProfile(user.uid);

            this.calculateStatistics(meals, userProfile.dailyCalorieGoal || 2000);
            this.generateChartHtml(meals);
            this.analyzeCommonFoods(meals);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    private getDateRange(): { start: Date, end: Date } {
        const end = new Date();
        const start = new Date();

        switch (this.selectedRangeIndex) {
            case 0: // Week
                start.setDate(end.getDate() - 7);
                break;
            case 1: // Month
                start.setMonth(end.getMonth() - 1);
                break;
            case 2: // Year
                start.setFullYear(end.getFullYear() - 1);
                break;
        }

        return { start, end };
    }

    private calculateStatistics(meals: Array<any>, dailyGoal: number) {
        this.totalMeals = meals.length;
        
        const dailyCalories = meals.reduce((acc, meal) => {
            const date = meal.timestamp.toDate().toDateString();
            acc[date] = (acc[date] || 0) + meal.calories;
            return acc;
        }, {});

        const dailyValues = Object.values(dailyCalories) as number[];
        this.averageCalories = dailyValues.length > 0 
            ? Math.round(dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length)
            : 0;
        
        this.highestDay = Math.max(...dailyValues, 0);
        
        const daysWithinGoal = dailyValues.filter(cal => cal <= dailyGoal).length;
        this.goalAchievement = dailyValues.length > 0
            ? Math.round((daysWithinGoal / dailyValues.length) * 100)
            : 0;
    }

    private generateChartHtml(meals: Array<any>) {
        // Generate Chart.js HTML for the WebView
        this.chartHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            </head>
            <body>
                <canvas id="caloriesChart"></canvas>
                <script>
                    const ctx = document.getElementById('caloriesChart');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ${JSON.stringify(this.getChartLabels())},
                            datasets: [{
                                label: 'Calories',
                                data: ${JSON.stringify(this.getChartData(meals))},
                                borderColor: 'rgb(34, 197, 94)',
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }

    private getChartLabels(): string[] {
        const range = this.getDateRange();
        const labels = [];
        const current = new Date(range.start);

        while (current <= range.end) {
            labels.push(current.toLocaleDateString());
            current.setDate(current.getDate() + 1);
        }

        return labels;
    }

    private getChartData(meals: Array<any>): number[] {
        const dailyCalories = meals.reduce((acc, meal) => {
            const date = meal.timestamp.toDate().toLocaleDateString();
            acc[date] = (acc[date] || 0) + meal.calories;
            return acc;
        }, {});

        return this.getChartLabels().map(date => dailyCalories[date] || 0);
    }

    private analyzeCommonFoods(meals: Array<any>) {
        const foodCounts: {[key: string]: number} = {};
        
        meals.forEach(meal => {
            meal.foods.forEach((food: {name: string}) => {
                foodCounts[food.name] = (foodCounts[food.name] || 0) + 1;
            });
        });

        this.commonFoods = Object.entries(foodCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }
}