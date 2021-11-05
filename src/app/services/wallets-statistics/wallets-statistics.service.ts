import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TWalletYearStatistics } from 'src/app/common/interfaces/wallet-statistics';
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

	year(year: number): Observable<TWalletYearStatistics> {
		return this._collection$.pipe(
			switchMap(collection => collection.doc<any>(String(year)).valueChanges())
		);
	}

	wallet(walletId: string, year: number): Observable<TWalletYearStatistics> {
		return this._collection$.pipe(
			switchMap(collection =>
				collection
					.doc<any>(`${year}/year-by-wallets/${walletId}`)
					.valueChanges()
			)
		);
	}
}
