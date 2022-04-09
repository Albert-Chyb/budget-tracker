import { Injectable } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { WalletYearStatistics } from '@models/wallet-statistics';
import { WalletStatisticsConverter } from '@models/wallets-statistics-converter';
import { CollectionsInfoService } from '@services/collections-info/collections-info.service';
import { UserService } from '@services/user/user.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class WalletsStatisticsService {
	constructor(
		private readonly _afStore: Firestore,
		private readonly _user: UserService,
		private readonly _collectionsInfo: CollectionsInfoService
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
	 * @returns Observable of array of years.
	 */
	availableYears(): Observable<number[]> {
		return this._collectionsInfo
			.read('wallets-statistics')
			.pipe(map(info => info?.distinct?.map(Number) ?? []));
	}
}
