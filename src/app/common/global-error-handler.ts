import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/app';

import { FirebaseError } from './errors/firebase-errors';

@Injectable({
	providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private readonly _injector: Injector) {}

	handleError(unhandled: any) {
		// Angular wraps unhandled errors in an Error object.
		// Actual thrown error is placed in the 'rejection' property.
		const actualThrown =
			'rejection' in unhandled ? unhandled.rejection : unhandled;

		if (actualThrown instanceof FirebaseError) {
			this._handleFirebaseError(actualThrown);
		} else {
			// Throw other errors back to the console.
			throw unhandled;
		}
	}

	private _handleFirebaseError(error: firebase.FirebaseError) {
		let msg: string = '';

		switch (error.code) {
			case 'auth/credential-already-in-use':
				msg = 'Wybrane konto istnieje już w serwisie.';
				break;

			case 'auth/cancelled-popup-request':
				msg = 'Tylko jedno okno logowania może być otwarte w tym samym czasie.';
				break;

			case 'auth/operation-not-supported-in-this-environment':
				msg = 'Logowanie może odbyć się tylko poprzez protoków http lub https.';
				break;

			case 'auth/popup-blocked':
				msg =
					'Okno logowania zostało zablokowane przez przeglądarkę. Sprawdź ustawienia okien Popup dla tej strony.';
				break;

			case 'auth/popup-closed-by-user':
				msg = 'Okno logowania zostało zamknięte za wcześnie.';
				break;

			default:
				msg = 'Podczas uwierzytelniania wystąpił nieoczekiwany błąd.';
				break;
		}

		if (msg) this._showMessage(msg);
	}

	private _showMessage(message: string) {
		const matSnackBar = this._injector.get(MatSnackBar);

		matSnackBar.open(message, 'Zamknij', {
			duration: 5000,
			verticalPosition: 'bottom',
			horizontalPosition: 'center',
		});
	}
}
