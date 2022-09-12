import { LOCALE_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAX_MONEY_AMOUNT_VALUE } from '@common/constants';
import { isNullish } from '@common/helpers/isNullish';
import { IWallet } from '@common/interfaces/wallet';
import { Money } from '@common/models/money';
import {
	AmountDialogComponent,
	AmountDialogConfig,
	AmountDialogResult as AmountDialogResultData,
} from '@components/amount-dialog/amount-dialog.component';
import { LoadingService } from '@services/loading/loading.service';
import { WalletsService } from '@services/wallets/wallets.service';
import { Observable } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { ActionDefinition } from './action-definition';

interface TransferMoneyActionPayload {
	sourceWallet: IWallet;
	targetWallet: IWallet;
}

export class TransferMoneyAction extends ActionDefinition<TransferMoneyActionPayload> {
	private readonly _wallets = this.getDependency(WalletsService);
	private readonly _localeId = this.getDependency(LOCALE_ID);
	private readonly _dialogs = this.getDependency(MatDialog);
	private readonly _loading = this.getDependency(LoadingService);

	/** Amount to transfer as an integer value. */
	private _amount: Money;

	get onCompleteMsg(): string {
		return `Poprawnie przesłano kwote: ${this._amount}`;
	}

	execute(): void | Observable<void> | Promise<void> {
		const { sourceWallet, targetWallet } = this.payload;
		const dialogConfig: AmountDialogConfig = {
			amount: new Money(0, this._localeId),
			min: new Money(1, this._localeId),
			max: this._calculateMaxTransferValue(sourceWallet, targetWallet),
		};

		return this._dialogs
			.open<AmountDialogComponent, AmountDialogConfig, AmountDialogResultData>(
				AmountDialogComponent,
				{ data: dialogConfig }
			)
			.afterClosed()
			.pipe(
				take(1),
				filter(amount => !isNullish(amount) && amount.asDecimal > 0),
				tap(amount => (this._amount = amount)),
				switchMap(() =>
					this._loading.add(
						this._wallets.transferMoney(
							sourceWallet.id,
							targetWallet.id,
							this._amount
						)
					)
				)
			);
	}

	undo(): void | Observable<void> | Promise<void> {
		const { sourceWallet, targetWallet } = this.payload;

		return this._loading.add(
			this._wallets.transferMoney(
				targetWallet.id,
				sourceWallet.id,
				this._amount
			)
		);
	}

	private _calculateMaxTransferValue(
		sourceWallet: IWallet,
		targetWallet: IWallet
	): Money {
		return Money.fromDecimal(
			Math.min(
				sourceWallet.balance.asDecimal,
				Money.fromDecimal(
					MAX_MONEY_AMOUNT_VALUE,
					this.getDependency(LOCALE_ID)
				).subtract(targetWallet.balance).asDecimal
			),
			this._localeId
		);
	}
}
