import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IWallet } from '@interfaces/wallet';

@Component({
	selector: 'wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent {
	constructor() {}

	@Input('wallet') wallet: IWallet;
	@Input('show-actions') showActions: boolean = false;
}
