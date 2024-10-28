import { Application } from '@nativescript/core';
import { initializeFirebase } from './services/firebase.service';

initializeFirebase();
Application.run({ moduleName: 'app-root' });