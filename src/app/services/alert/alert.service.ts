import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '@components/alert/alert.component';
import { first } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AlertService {
	constructor(private readonly _dialog: MatDialog) {}

	open(body: string, title?: string) {
		const dialogRef = this._dialog.open(AlertComponent, {
			data: { title, body },
			width: 'clamp(30rem, 70vw, 70rem)',
		});

		return dialogRef.afterClosed().pipe(first()).toPromise();
	}
}
