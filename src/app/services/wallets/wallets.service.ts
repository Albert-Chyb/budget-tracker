import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { FirebaseCallableFunctionsNames } from 'src/app/common/firebase-callable-functions';
import {
	IWallet,
	IWalletBase,
	IWalletReadPayload,
} from 'src/app/common/interfaces/wallet';
import { UserService } from '../user/user.service';

class FirestoreWalletConverter
	implements firebase.firestore.FirestoreDataConverter<IWalletBase>
{
	toFirestore(wallet: IWalletBase): IWalletBase {
		wallet.balance = ~~(wallet.balance * 100);

		return wallet;
	}

	fromFirestore(
		snapshot: firebase.firestore.QueryDocumentSnapshot<IWalletBase>,
		options: firebase.firestore.SnapshotOptions
	): IWallet {
		const data = snapshot.data();

		return { ...data, id: snapshot.id, balance: data.balance / 100 };
	}
}

@Injectable({
	providedIn: 'root',
})
export class WalletsService {
	constructor(
		private readonly _user: UserService,
		private readonly _afStore: AngularFirestore,
		private readonly _afFunctions: AngularFireFunctions
	) {}

	private readonly _converter = new FirestoreWalletConverter();

	getAll(): Observable<IWallet[]> {
		return this._user.getUid$().pipe(
			switchMap(uid => {
				const walletsRef = this._afStore
					.collection(`users/${uid}/wallets`)
					.ref.withConverter(this._converter);

				return this._afStore.collection<any>(walletsRef).valueChanges();
			})
		);
	}

	async updateName(wallet: IWallet | string, name: string): Promise<void> {
		const walletId = this._getWalletId(wallet);
		const userId = await this._user.getUid();
		const walletRef = this._afStore
			.doc(`users/${userId}/wallets/${walletId}`)
			.ref.withConverter(this._converter);

		return this._afStore.doc<any>(walletRef).update({ name });
	}

	async create(
		newWallet: IWalletBase
	): Promise<DocumentReference<IWalletReadPayload>> {
		const userId = await this._user.getUid();
		const walletsRef = this._afStore
			.collection<IWallet>(`users/${userId}/wallets`)
			.ref.withConverter(this._converter);

		return this._afStore.collection<any>(walletsRef).add(newWallet);
	}

	async delete(wallet: string | IWallet): Promise<void> {
		const deleteWallet = this._afFunctions.httpsCallable(
			FirebaseCallableFunctionsNames.DeleteWallet
		);
		const res$ = deleteWallet({ id: this._getWalletId(wallet) });

		return res$
			.pipe(
				first(),
				map(res => {
					if (res.result === 'error') {
						throw res;
					}

					return null;
				})
			)
			.toPromise();
	}

	private _getWalletId(wallet: IWallet | string): string {
		return typeof wallet === 'string' ? wallet : wallet.id;
	}
}
