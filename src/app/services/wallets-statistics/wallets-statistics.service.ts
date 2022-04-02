import { Injectable } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { WalletYearStatistics } from 'src/app/common/models/wallet-statistics';
import { WalletStatisticsConverter } from 'src/app/common/models/wallets-statistics-converter';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class WalletsStatisticsService {
	constructor(
		private readonly _afStore: Firestore,
		private readonly _user: UserService
	) {}

	private readonly _collection$ = this._user
		.getUid$()
		.pipe(
			map(uid =>
				collection(
					this._afStore,
					`users/${uid}/wallets-statistics/`
				).withConverter(new WalletStatisticsConverter())
			)
		);

	year(year: number): Observable<WalletYearStatistics> {
		return this._collection$.pipe(
			switchMap(collection => docData(doc(collection, String(year)))),
			map(statistics => new WalletYearStatistics(statistics, year))
		);
	}

	wallet(walletId: string, year: number): Observable<WalletYearStatistics> {
		return this._collection$.pipe(
			switchMap(collection =>
				docData(doc(collection, `${year}/year-by-wallets/${walletId}`))
			),
			map(statistics => new WalletYearStatistics(statistics, year))
		);
	}

	/**
	 * Gets years for which statistics exists in the database.
	 *
	 * Not implemented yet. For now it returns static array of years.
	 */
	availableYears(): Observable<number[]> {
		return of([2020, 2021, 2022, 2023]);
	}
}
