import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertComponent } from 'src/app/components/alert/alert.component';

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
