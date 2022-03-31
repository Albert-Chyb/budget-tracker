import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { FirebaseCallableFunctionsNames } from 'src/app/common/firebase-callable-functions';
import {
	IWallet,
	IWalletCreatePayload,
	IWalletUpdatePayload,
} from 'src/app/common/interfaces/wallet';
import {
	ALL_MIXINS,
	Collection,
	Create,
	Delete,
	List,
	Put,
	Read,
	Update,
} from 'src/app/common/models/collection';
import { FirestoreWalletConverter } from 'src/app/common/models/firestore-wallet-converter';
import { UserService } from '../user/user.service';

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
		afStore: AngularFirestore,
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
			FirebaseCallableFunctionsNames.DeleteWallet
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
