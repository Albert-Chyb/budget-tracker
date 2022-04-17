import { ErrorHandler, Injectable } from '@angular/core';
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
import { from, Observable, of } from 'rxjs';
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
		afStore: Firestore,
		user: UserService,
		private readonly _afFunctions: Functions,
		private readonly _errorHandler: ErrorHandler
	) {
		super(
			afStore,
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
				this._handleError(error);

				return of(null);
			}),
			mapTo(null)
		);
	}

	private _handleError(error: any) {
		if (error instanceof FirebaseError && error.code === 'functions/aborted') {
			this._errorHandler.handleError(
				new AppError(
					'Cannot delete a wallet that is referenced by a transaction',
					ErrorCode.WalletReferenced
				)
			);
		} else {
			this._errorHandler.handleError(error);
		}
	}
}
