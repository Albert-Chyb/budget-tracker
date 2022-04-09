import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ErrorsService } from '@services/errors/errors.service';
import { DEFAULT_ERROR_CODE, getErrorMessage } from './errors-messages-pl';

@Injectable({
	providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
	constructor(
		private readonly _errors: ErrorsService,
		private readonly _zone: NgZone
	) {}

	handleError(unhandled: any) {
		const actualThrown = this._extractThrownError(unhandled);

		if ('code' in actualThrown) {
			this._showMessage(getErrorMessage(actualThrown.code));
		} else {
			this._showMessage(getErrorMessage(DEFAULT_ERROR_CODE));
			console.error(actualThrown);
		}
	}

	private _showMessage(message: string) {
		this._zone.run(() => this._errors.show(message));
	}

	private _extractThrownError(error: any) {
		// Angular wraps unhandled errors in an Error object.
		// Actual thrown error is placed in the 'rejection' property.

		return 'rejection' in error ? error.rejection : error;
	}
}
