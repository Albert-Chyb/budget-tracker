import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IWalletBase } from 'src/app/common/interfaces/wallet';
import { moneyAmountPattern } from 'src/app/common/validators/money-amount-pattern';

@Component({
	templateUrl: './new-wallet-dialog.component.html',
	styleUrls: ['./new-wallet-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWalletDialogComponent {
	wallet: IWalletBase = {
		name: '',
		balance: 0,
	};

	readonly moneyAmountPattern = moneyAmountPattern;

	processForm(wallet: IWalletBase) {
		return { ...wallet, balance: Number(wallet.balance) };
	}
}
