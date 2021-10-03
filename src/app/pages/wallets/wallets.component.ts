import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { INewWallet, IWallet } from 'src/app/common/interfaces/wallet';
import { LoadingIndicatorComponent } from 'src/app/components/loading-indicator/loading-indicator.component';
import { NewWalletDialogComponent } from 'src/app/components/new-wallet-dialog/new-wallet-dialog.component';
import { DEFAULT_CLUE_NAME } from 'src/app/directives/clue-if/clue-if.directive';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { PromptService } from 'src/app/services/prompt/prompt.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

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
		private readonly _prompt: PromptService,
		private readonly _loading: LoadingService,
		private readonly _alert: AlertService
	) {}

	wallets$ = this._loading.add(this._wallets.getAll());

	async deleteWallet(wallet: IWallet) {
		try {
			await this._wallets.delete(wallet);
		} catch (error: any) {
			this._handleError(error);
		}
	}

	updateName(wallet: IWallet, loading: LoadingIndicatorComponent) {
		const name$ = this._prompt.open({
			title: 'Zmiana nazwy portfela',
			label: 'Nowa nazwa',
			value: wallet.name,
		});

		name$.pipe(take(1)).subscribe(name => {
			if (name && name !== wallet.name)
				loading.pending(this._wallets.updateName(wallet, name));
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

	private _handleError(error: any) {
		if (error.code === 'is-referenced') {
			this._alert.open(
				'Ten portfel zawiera przynajmniej jedną transakcję. Aby usunąć portfel musisz najpierw usunąć wszystkie transakcje znajdujące się w nim.',
				'Błąd podczas usuwania portfela'
			);
		} else {
			throw error;
		}
	}
}
