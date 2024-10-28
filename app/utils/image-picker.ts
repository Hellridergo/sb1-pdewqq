import { ImagePicker } from '@nativescript/core';

export async function pickImage(): Promise<any> {
    const context = {
        mode: 'single',
        mediaType: ImagePicker.ImageType.IMAGE
    };

    const selection = await ImagePicker.create(context).present();
    return selection && selection.length > 0 ? selection[0] : null;
}