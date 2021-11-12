import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	Optional,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DEFAULT_CLUE_NAME } from 'src/app/directives/clue-if/clue-if.directive';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

export type TWalletPickerValue = string | 'all' | undefined | null;

@Component({
	selector: 'app-wallet-picker',
	templateUrl: './wallet-picker.component.html',
	styleUrls: ['./wallet-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: DEFAULT_CLUE_NAME,
			useValue: 'noWallets',
		},
	],
})
export class WalletPickerComponent {
	constructor(
		private readonly _wallets: WalletsService,

		@Optional()
		@Inject(MAT_DIALOG_DATA)
		private readonly _initialValue: TWalletPickerValue
	) {}

	wallets$ = this._wallets.list();
	selectedWallet: [TWalletPickerValue] = [this._initialValue];
}
