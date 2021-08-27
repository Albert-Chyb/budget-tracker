import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { INewWallet, IWallet } from 'src/app/common/interfaces/wallet';
import { NewWalletDialogComponent } from 'src/app/components/new-wallet-dialog/new-wallet-dialog.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { PromptService } from 'src/app/services/prompt/prompt.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

@Component({
	templateUrl: './wallets.component.html',
	styleUrls: ['./wallets.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsComponent {
	constructor(
		private readonly _wallets: WalletsService,
		private readonly _dialog: MatDialog,
		private readonly _prompt: PromptService,
		private readonly _loading: LoadingService
	) {}

	wallets$ = this._loading.add(this._wallets.getAll());

	deleteWallet(wallet: IWallet) {
		this._loading.add(this._wallets.delete(wallet));
	}

	updateName(wallet: IWallet) {
		const name$ = this._prompt.open({
			title: 'Zmiana nazwy portfela',
			label: 'Nowa nazwa',
			value: wallet.name,
		});

		name$.pipe(take(1)).subscribe(name => {
			if (name && name !== wallet.name)
				this._loading.add(this._wallets.updateName(wallet, name));
		});
	}

	async createWallet() {
		const data: INewWallet = await this._dialog
			.open(NewWalletDialogComponent)
			.afterClosed()
			.pipe(take(1))
			.toPromise();

		if (data) this._loading.add(this._wallets.create(data));
	}

	trackById(index: number, wallet: IWallet) {
		return wallet.id;
	}
}
