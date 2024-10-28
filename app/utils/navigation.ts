import { Frame } from '@nativescript/core';

export function navigate(page: string, options = {}) {
    Frame.topmost().navigate({
        moduleName: page,
        ...options
    });
}