import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class WalletsStatisticsService {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _user: UserService
	) {}

	private readonly _collection$ = this._user
		.getUid$()
		.pipe(
			map(uid => this._afStore.collection(`users/${uid}/wallets-statistics/`))
		);

	year(year: number) {
		return this._collection$.pipe(
			switchMap(collection => collection.doc(String(year)).valueChanges())
		);
	}

	wallet(walletId: string, year: number) {
		return this._collection$.pipe(
			switchMap(collection =>
				collection.doc(`${year}/year-by-wallets/${walletId}`).valueChanges()
			)
		);
	}
}
