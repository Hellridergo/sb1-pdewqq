import { Observable, ImageSource, Camera, ImageAsset } from '@nativescript/core';
import { VisionService, FoodAnalysis } from '../../services/vision.service';
import { ImageService } from '../../services/image.service';
import { MealService } from '../../services/meal.service';
import { navigate } from '../../utils/navigation';
import { auth } from '../../services/firebase.service';
import { pickImage } from '../../utils/image-picker';

export class AddMealViewModel extends Observable {
    private _mealImage: ImageSource | null = null;
    private _isAnalyzing: boolean = false;
    private _analysisComplete: boolean = false;
    private _detectedFoods: Array<{name: string, calories: number, portion: string}> = [];
    private _totalCalories: number = 0;

    constructor() {
        super();
    }

    get mealImage(): ImageSource | null { return this._mealImage; }
    set mealImage(value: ImageSource | null) {
        if (this._mealImage !== value) {
            this._mealImage = value;
            this.notifyPropertyChange('mealImage', value);
        }
    }

    get isAnalyzing(): boolean { return this._isAnalyzing; }
    set isAnalyzing(value: boolean) {
        if (this._isAnalyzing !== value) {
            this._isAnalyzing = value;
            this.notifyPropertyChange('isAnalyzing', value);
        }
    }

    get analysisComplete(): boolean { return this._analysisComplete; }
    set analysisComplete(value: boolean) {
        if (this._analysisComplete !== value) {
            this._analysisComplete = value;
            this.notifyPropertyChange('analysisComplete', value);
        }
    }

    get detectedFoods(): Array<{name: string, calories: number, portion: string}> {
        return this._detectedFoods;
    }
    set detectedFoods(value: Array<{name: string, calories: number, portion: string}>) {
        if (this._detectedFoods !== value) {
            this._detectedFoods = value;
            this.notifyPropertyChange('detectedFoods', value);
        }
    }

    get totalCalories(): number { return this._totalCalories; }
    set totalCalories(value: number) {
        if (this._totalCalories !== value) {
            this._totalCalories = value;
            this.notifyPropertyChange('totalCalories', value);
        }
    }

    async onTakePhoto() {
        try {
            const image = await Camera.takePicture();
            await this.processImage(image);
        } catch (error) {
            console.error('Error taking photo:', error);
            // Show error dialog
        }
    }

    async onSelectPhoto() {
        try {
            const selection = await pickImage();
            if (selection) {
                await this.processImage(selection);
            }
        } catch (error) {
            console.error('Error selecting photo:', error);
            // Show error dialog
        }
    }

    private async processImage(image: ImageAsset) {
        try {
            this.isAnalyzing = true;
            this.mealImage = await ImageSource.fromAsset(image);

            // Analyze image with OpenAI
            const analysis = await VisionService.analyzeFoodImage(
                this.mealImage.toBase64String('jpg')
            );

            this.detectedFoods = analysis.foods;
            this.totalCalories = analysis.totalCalories;
            this.analysisComplete = true;
        } catch (error) {
            console.error('Error processing image:', error);
            // Show error dialog
        } finally {
            this.isAnalyzing = false;
        }
    }

    async onSaveMeal() {
        try {
            const user = auth().currentUser;
            if (!user || !this.mealImage) return;

            // Upload image to Firebase Storage
            const imageUrl = await ImageService.uploadMealImage(this.mealImage, user.uid);

            // Save meal to Firestore
            await MealService.addMeal({
                userId: user.uid,
                name: this.detectedFoods.map(f => f.name).join(', '),
                calories: this.totalCalories,
                imageUrl,
                timestamp: new Date(),
                foods: this.detectedFoods
            });

            navigate('pages/home/home-page');
        } catch (error) {
            console.error('Error saving meal:', error);
            // Show error dialog
        }
    }
}