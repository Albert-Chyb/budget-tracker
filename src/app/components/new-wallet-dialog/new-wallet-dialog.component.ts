import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MAX_MONEY_AMOUNT_VALUE } from '@common/constants';
import { IWalletCreatePayload } from '@interfaces/wallet';

@Component({
	templateUrl: './new-wallet-dialog.component.html',
	styleUrls: ['./new-wallet-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWalletDialogComponent {
	wallet: IWalletCreatePayload = {
		name: '',
		balance: null,
	};

	readonly maxMoneyAmount = MAX_MONEY_AMOUNT_VALUE;
}
