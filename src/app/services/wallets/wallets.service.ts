import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { AppError } from '@common/errors/app-error';
import { ErrorCode } from '@common/errors/error-code';
import { CloudFunction } from '@common/firebase/cloud-functions/callable-functions';
import { FirestoreWalletConverter } from '@common/firebase/firestore/wallet-converter';
import {
	IWallet,
	IWalletCreatePayload,
	IWalletUpdatePayload,
} from '@interfaces/wallet';
import {
	ALL_MIXINS,
	Collection,
	Create,
	Delete,
	List,
	Put,
	Read,
	Update,
} from '@models/collection';
import { UserService } from '@services/user/user.service';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';

interface Methods
	extends Create<IWalletCreatePayload, IWallet>,
		Read<IWallet>,
		List<IWallet>,
		Update<IWalletUpdatePayload>,
		Delete,
		Put<IWalletCreatePayload> {}

@Injectable({
	providedIn: 'root',
})
export class WalletsService extends Collection<Methods>(...ALL_MIXINS) {
	constructor(
		firestore: Firestore,
		user: UserService,
		private readonly _afFunctions: Functions
	) {
		super(
			firestore,
			user.getUid$().pipe(map(uid => `users/${uid}/wallets`)),
			new FirestoreWalletConverter()
		);
	}

	delete(id: string): Observable<void> {
		const deleteWallet = httpsCallable(
			this._afFunctions,
			CloudFunction.DeleteWallet
		);
		const res$ = from(deleteWallet({ id }));

		return res$.pipe(
			catchError(error => {
				if (
					error instanceof FirebaseError &&
					error.code === 'functions/aborted'
				) {
					return throwError(
						new AppError(
							'Cannot delete a wallet that is referenced by a transaction',
							ErrorCode.WalletReferenced
						)
					);
				} else {
					return throwError(error);
				}
			}),
			mapTo(null)
		);
	}

	/**
	 * Transfers money between two different wallets.
	 * @param sourceWallet Id of a wallet that money should be transferred from.
	 * @param targetWallet Id of a wallet that money should be transferred to.
	 * @param amount Amount of money to transfer.
	 * @returns Observable that emits when transfer was finalized.
	 */
	transferMoney(
		sourceWallet: string,
		targetWallet: string,
		amount: number
	): Observable<void> {
		const transferMoneyFn = httpsCallable(
			this._afFunctions,
			CloudFunction.TransferMoney
		);

		const res$ = from(transferMoneyFn({ sourceWallet, targetWallet, amount }));

		return res$.pipe(mapTo(null));
	}
}
