import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { EMPTY, throwError } from 'rxjs';
import { catchError, first, map, switchMap, take } from 'rxjs/operators';
import { INewWallet, IWallet } from 'src/app/common/interfaces/wallet';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class WalletsService {
	constructor(
		private readonly _user: UserService,
		private readonly _afStore: AngularFirestore,
		private readonly _afFunctions: AngularFireFunctions
	) {}

	getAll() {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this._afStore
						.collection<IWallet>(`users/${uid}/wallets`)
						.valueChanges({ idField: 'id' })
				)
			);
	}

	async updateName(wallet: IWallet | string, name: string) {
		const walletId = this._getWalletId(wallet);
		const userId = await this._user.getUid();

		return this._afStore
			.doc<IWallet>(`users/${userId}/wallets/${walletId}`)
			.update({ name });
	}

	async create(newWallet: INewWallet) {
		const userId = await this._user.getUid();

		return this._afStore
			.collection<IWallet>(`users/${userId}/wallets`)
			.add(newWallet as any);
	}

	async delete(wallet: string | IWallet) {
		const deleteWallet = this._afFunctions.httpsCallable('deleteWallet');
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
