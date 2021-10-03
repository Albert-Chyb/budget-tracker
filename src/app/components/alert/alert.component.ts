import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AlertDialogData {
	title: string;
	body: string;
}

@Component({
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public readonly data: AlertDialogData) {}
}
