import { EventData, Page, NavigatedData } from '@nativescript/core';
import { MealDetailsViewModel } from './meal-details-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const mealId = args.context.mealId;
    page.bindingContext = new MealDetailsViewModel(mealId);
}