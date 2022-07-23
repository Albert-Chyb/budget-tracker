import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAX_MONEY_AMOUNT_VALUE } from '@common/constants';
import { isNullish } from '@common/helpers/isNullish';
import { IWallet } from '@common/interfaces/wallet';
import {
	AmountDialogComponent,
	AmountDialogConfig,
	AmountDialogResult as AmountDialogResultData,
} from '@components/amount-dialog/amount-dialog.component';
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
	private readonly _currencyCode = this.getDependency(DEFAULT_CURRENCY_CODE);
	private readonly _dialogs = this.getDependency(MatDialog);

	/** Amount to transfer as an integer value. */
	private _amount = 0;

	get onCompleteMsg(): string {
		return `Poprawnie przesłano kwote: ${this._formatCurrency(
			this._amount / 100
		)}`;
	}

	execute(): void | Observable<void> | Promise<void> {
		const { sourceWallet, targetWallet } = this.payload;
		const dialogConfig: AmountDialogConfig = {
			amount: 0,
			min: 0.01,
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
				filter(amount => !isNullish(amount) && amount > 0),
				tap(value => console.log(`Otrzymana wartość: ${value}`)),
				tap(amount => (this._amount = Math.trunc(amount * 100))),
				switchMap(() =>
					this._wallets.transferMoney(
						sourceWallet.id,
						targetWallet.id,
						this._amount
					)
				)
			);
	}

	undo(): void | Observable<void> | Promise<void> {
		const { sourceWallet, targetWallet } = this.payload;

		return this._wallets.transferMoney(
			targetWallet.id,
			sourceWallet.id,
			this._amount
		);
	}

	private _formatCurrency(amount: number) {
		return formatCurrency(
			amount,
			this._localeId,
			getCurrencySymbol(this._currencyCode, 'wide', this._localeId),
			this._currencyCode
		);
	}

	private _calculateMaxTransferValue(
		sourceWallet: IWallet,
		targetWallet: IWallet
	) {
		return Math.min(
			sourceWallet.balance,
			MAX_MONEY_AMOUNT_VALUE - targetWallet.balance
		);
	}
}
