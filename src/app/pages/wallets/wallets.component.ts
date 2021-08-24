import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { IWallet } from 'src/app/common/interfaces/wallet';
import { NewWalletDialogComponent } from 'src/app/components/new-wallet-dialog/new-wallet-dialog.component';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

@Component({
	templateUrl: './wallets.component.html',
	styleUrls: ['./wallets.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsComponent implements OnInit {
	constructor(
		private readonly _wallets: WalletsService,
		private readonly _dialog: MatDialog
	) {}

	wallets$: Observable<IWallet[]> = this._wallets.getAll();

	ngOnInit() {
		this._displayNewWalletDialog();
	}

	deleteWallet(wallet: IWallet) {
		this._wallets.delete(wallet);
	}

	createWallet() {
		this._displayNewWalletDialog();
	}

	private _displayNewWalletDialog() {
		const dialogRef = this._dialog.open(NewWalletDialogComponent);

		dialogRef
			.afterClosed()
			.pipe(
				first(),
				filter(value => value !== null)
			)
			.subscribe(console.log);
	}
}
