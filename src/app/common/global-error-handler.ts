import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { ErrorsService } from '../services/errors/errors.service';
import { AppError } from './errors/app-error';
import { ErrorCode } from './errors/error-code';

@Injectable({
	providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
	constructor(
		private readonly _errors: ErrorsService,
		private readonly _zone: NgZone
	) {}

	handleError(unhandled: any) {
		// Angular wraps unhandled errors in an Error object.
		// Actual thrown error is placed in the 'rejection' property.
		const actualThrown = this._extractThrownError(unhandled);

		if (
			actualThrown instanceof FirebaseError &&
			actualThrown.code.startsWith('auth')
		) {
			this._handleFirebaseAuthError(<any>actualThrown);
		} else if (actualThrown instanceof AppError) {
			this._handleAppError(actualThrown);
		} else {
			// Throw other errors back to the console.
			console.error(actualThrown);
		}
	}

	private _handleAppError(error: AppError) {
		let msg: string;

		switch (error.code) {
			case ErrorCode.TransactionNotFound:
				msg = 'Transakcja nie została znaleziona.';
				break;

			default:
				msg = 'Wystąpił nieoczekiwany błąd.';
				break;
		}

		this._errors.show(msg);
	}

	private _handleFirebaseAuthError(error: FirebaseError) {
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
				msg = 'Podczas autoryzacji wystąpił nieoczekiwany błąd.';
				break;
		}

		if (msg) this._showMessage(msg);
	}

	private _showMessage(message: string) {
		this._zone.run(() => this._errors.show(message));
	}

	private _extractThrownError(error: any) {
		return 'rejection' in error ? error.rejection : error;
	}
}
