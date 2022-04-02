import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { ErrorsService } from '../services/errors/errors.service';

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

		if (this._isFirebaseError(actualThrown)) {
			this._handleFirebaseError(<any>actualThrown);
		} else {
			// Throw other errors back to the console.
			this._handleUnknownError(actualThrown);
		}
	}

	private _handleFirebaseError(error: FirebaseError) {
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
				this._handleUnknownError(error);
				break;
		}

		if (msg) this._showMessage(msg);
	}

	private _isFirebaseError(error: any): boolean {
		return 'name' in error && error?.name === 'FirebaseError';
	}

	private _showMessage(message: string) {
		const matSnackBar = this._injector.get(ErrorsService);

		matSnackBar.show(message);
	}

	private _handleUnknownError(error: any) {
		console.error(error);
	}
}
