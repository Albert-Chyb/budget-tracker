import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	Input,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

const DEFAULT_CONFIG: AmountDialogConfig = Object.freeze({
	amount: 0,
	min: 0,
	max: 100,
});

export type AmountDialogResult = number;

export interface AmountDialogConfig {
	amount?: number;
	min?: number;
	max?: number;
}

@Component({
	templateUrl: './amount-dialog.component.html',
	styleUrls: ['./amount-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountDialogComponent {
	amount: number;

	@Input() min: number;
	@Input() max: number;

	constructor(@Inject(MAT_DIALOG_DATA) receivedConfig: AmountDialogConfig) {
		const config: AmountDialogConfig = {
			...DEFAULT_CONFIG,
			...receivedConfig,
		};

		this.amount = config.amount;
		this.min = config.min;
		this.max = config.max;
	}
}
