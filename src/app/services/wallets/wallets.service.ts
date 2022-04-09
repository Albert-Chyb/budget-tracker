import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
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
import { from, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

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
		private readonly _afFunctions: Functions
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
			map((res: any) => {
				if (res.result === 'error') throw res;
			}),
			mapTo(null)
		);
	}
}
