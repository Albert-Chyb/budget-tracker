import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class ErrorsService {
	constructor(private readonly _matSnackBar: MatSnackBar) {}

	show(message: string) {
		this._matSnackBar.open(message, undefined, { duration: 5_000 });
	}
}
