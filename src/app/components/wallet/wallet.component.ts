import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IWallet } from '@interfaces/wallet';

@Component({
	selector: 'wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent implements OnChanges {
	@Input('wallet') wallet: IWallet;
	@Input('show-actions') showActions: boolean = false;
	@Input('wallets') wallets: IWallet[] = [];

	ngOnChanges(changes: SimpleChanges): void {
		if ('wallet' in changes || 'wallets' in changes) {
			const wallet: IWallet = changes.wallet?.currentValue ?? this.wallet;
			const wallets: IWallet[] = changes.wallets?.currentValue ?? this.wallets;

			this.wallets = wallets.filter(
				currentWallet => currentWallet.id !== wallet.id
			);
		}
	}
}
