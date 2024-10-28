import { ImageSource } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-storage';

const storage = firebase().storage();

export class ImageService {
    static async uploadMealImage(imageSource: ImageSource, userId: string): Promise<string> {
        try {
            const imagePath = `meals/${userId}/${Date.now()}.jpg`;
            const reference = storage.ref(imagePath);
            
            // Convert ImageSource to base64
            const base64 = imageSource.toBase64String('jpg');
            
            // Upload image
            await reference.putString(base64, 'base64');
            
            // Get download URL
            return await reference.getDownloadURL();
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}