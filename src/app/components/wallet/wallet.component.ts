import {
	ChangeDetectionStrategy,
	Component,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
import { IWallet } from 'src/app/common/interfaces/wallet';

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
	@Output('onWalletEdit') onWalletEdit = new EventEmitter<IWallet>();
	@Output('onWalletDelete') onWalletDelete = new EventEmitter<IWallet>();
}
