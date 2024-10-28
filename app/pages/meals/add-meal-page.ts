import { EventData, Page } from '@nativescript/core';
import { AddMealViewModel } from './add-meal-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new AddMealViewModel();
}