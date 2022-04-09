import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { NewWalletDialogComponent } from '@components/new-wallet-dialog/new-wallet-dialog.component';
import { DEFAULT_CLUE_NAME } from '@directives/clue-if/clue-if.directive';
import { IWallet, IWalletBase } from '@interfaces/wallet';
import { AlertService } from '@services/alert/alert.service';
import { LoadingService } from '@services/loading/loading.service';
import { PromptService } from '@services/prompt/prompt.service';
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
		private readonly _prompt: PromptService,
		private readonly _loading: LoadingService,
		private readonly _alert: AlertService
	) {}

	wallets$ = this._wallets.list();

	async deleteWallet(wallet: IWallet) {
		try {
			await this._wallets.delete(wallet.id).pipe(first()).toPromise();
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
				loading.pending(
					this._wallets.update(wallet.id, { name }).pipe(first()).toPromise()
				);
		});
	}

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
