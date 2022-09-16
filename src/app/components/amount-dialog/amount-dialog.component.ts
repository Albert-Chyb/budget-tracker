import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	Input,
	LOCALE_ID,
} from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Money } from '@common/models/money';
import { maxMoneyAmount } from '@common/validators/max-money-amount-validator';
import { minMoneyAmount } from '@common/validators/min-money-amount-validator';

const DEFAULT_CONFIG: (localeId: string) => AmountDialogConfig = (
	localeId: string
) => ({
	amount: new Money(0, localeId),
	min: new Money(0, localeId),
	max: new Money(0, localeId),
});

export type AmountDialogResult = Money;

export interface AmountDialogConfig {
	amount?: Money;
	min?: Money;
	max?: Money;
}

@Component({
	templateUrl: './amount-dialog.component.html',
	styleUrls: ['./amount-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountDialogComponent {
	amount: Money;

	@Input() min: Money;
	@Input() max: Money;

	constructor(
		@Inject(MAT_DIALOG_DATA) receivedConfig: AmountDialogConfig,
		private readonly _dialogRef: MatDialogRef<
			AmountDialogComponent,
			AmountDialogResult
		>,
		@Inject(LOCALE_ID) private readonly _localeId: string
	) {
		const config: AmountDialogConfig = {
			...DEFAULT_CONFIG(this._localeId),
			...receivedConfig,
		};

		this.amount = config.amount;
		this.min = config.min;
		this.max = config.max;
	}

	handleSubmit() {
		this._dialogRef.close(this.amount);
	}

	amountValidator: ValidatorFn = (control: AbstractControl<Money>) => ({
		...minMoneyAmount(this.min, true)(control),
		...maxMoneyAmount(this.max, true)(control),
	});
}
