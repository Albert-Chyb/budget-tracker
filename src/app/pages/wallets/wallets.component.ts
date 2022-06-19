import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewWalletDialogComponent } from '@components/new-wallet-dialog/new-wallet-dialog.component';
import { DEFAULT_CLUE_NAME } from '@directives/clue-if/clue-if.directive';
import { IWallet, IWalletBase } from '@interfaces/wallet';
import { LoadingService } from '@services/loading/loading.service';
import { WalletsService } from '@services/wallets/wallets.service';
import { first, take } from 'rxjs/operators';

@Component({
	templateUrl: './wallets.component.html',
	styleUrls: ['./wallets.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: DEFAULT_CLUE_NAME,
			useValue: 'noWallets',
		},
	],
})
export class WalletsComponent {
	constructor(
		private readonly _wallets: WalletsService,
		private readonly _dialog: MatDialog,
		private readonly _loading: LoadingService
	) {}

	wallets$ = this._wallets.list();

	async createWallet() {
		const data: IWalletBase = await this._dialog
			.open(NewWalletDialogComponent)
			.afterClosed()
			.pipe(take(1))
			.toPromise();

		if (data)
			this._loading.add(this._wallets.create(data).pipe(first())).subscribe();
	}

	trackById(index: number, wallet: IWallet) {
		return wallet.id;
	}
}
