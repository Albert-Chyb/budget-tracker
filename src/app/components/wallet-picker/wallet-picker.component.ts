import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IWallet } from 'src/app/common/interfaces/wallet';
import { DEFAULT_CLUE_NAME } from 'src/app/directives/clue-if/clue-if.directive';

export type TWalletPickerValue = string | 'all' | undefined | null;

export interface IWalletPickerInjectorData {
	value: TWalletPickerValue;
	wallets$: Observable<IWallet[]>;
}

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
		@Inject(MAT_DIALOG_DATA)
		private readonly _data: IWalletPickerInjectorData
	) {}

	wallets$ = this._data.wallets$;
	selectedWallet: [TWalletPickerValue] = [this._data.value];
}
