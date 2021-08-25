import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { INewWallet, IWallet } from 'src/app/common/interfaces/wallet';
import { PromptService } from 'src/app/services/prompt/prompt.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

import { NewWalletDialogComponent } from '../new-wallet-dialog/new-wallet-dialog.component';

@Component({
	selector: 'wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent {
	constructor(
		private readonly _wallets: WalletsService,
		private readonly _dialog: MatDialog,
		private readonly _prompt: PromptService
	) {}

	@Input('wallet') wallet: IWallet;
	@Input('show-actions') showActions: boolean = false;

	deleteWallet() {
		this._wallets.delete(this.wallet);
	}

	updateName() {
		const name$ = this._prompt.open({
			title: 'Zmiana nazwy portfela',
			label: 'Nowa nazwa',
			value: this.wallet.name,
		});

		name$.pipe(take(1)).subscribe(name => {
			if (name && name !== this.wallet.name)
				this._wallets.updateName(this.wallet, name);
		});
	}

	async createWallet() {
		const data: INewWallet = await this._dialog
			.open(NewWalletDialogComponent)
			.afterClosed()
			.pipe(take(1))
			.toPromise();

		if (data) this._wallets.create(data);
	}
}
