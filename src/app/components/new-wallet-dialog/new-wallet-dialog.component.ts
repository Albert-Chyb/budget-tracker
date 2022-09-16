import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	LOCALE_ID,
} from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MAX_MONEY_AMOUNT_VALUE } from '@common/constants';
import { Money } from '@common/models/money';
import { maxMoneyAmount } from '@common/validators/max-money-amount-validator';
import { minMoneyAmount } from '@common/validators/min-money-amount-validator';
import { IWalletCreatePayload } from '@interfaces/wallet';

@Component({
	templateUrl: './new-wallet-dialog.component.html',
	styleUrls: ['./new-wallet-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWalletDialogComponent {
	constructor(@Inject(LOCALE_ID) private readonly _localeId: string) {}

	wallet: IWalletCreatePayload = {
		name: '',
		balance: null,
	};

	readonly amountValidator: ValidatorFn = (
		control: AbstractControl<Money>
	) => ({
		...minMoneyAmount(new Money(0, this._localeId), true)(control),
		...maxMoneyAmount(
			Money.fromDecimal(MAX_MONEY_AMOUNT_VALUE, this._localeId),
			true
		)(control),
	});
}
