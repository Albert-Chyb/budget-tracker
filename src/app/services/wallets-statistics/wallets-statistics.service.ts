import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { isNullish } from '@common/helpers/isNullish';
import { Money } from '@common/models/money';
import { PeriodStatistics } from '@common/models/period-statistics';
import { TimePeriod } from '@common/models/time-period';
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
		private readonly _collectionsInfo: CollectionsInfoService,
		@Inject(LOCALE_ID) private readonly _localeId: string
	) {}

	private readonly _collection$ = this._user
		.getUid$()
		.pipe(
			map(uid =>
				collection(
					this._afStore,
					`users/${uid}/wallets-statistics/`
				).withConverter(new WalletStatisticsConverter(this._localeId))
			)
		);

	year(year: number): Observable<PeriodStatistics> {
		return this._collection$.pipe(
			switchMap(collection => docData(doc(collection, String(year)))),
			map(statistics =>
				isNullish(statistics)
					? new PeriodStatistics(
							new Money(0, this._localeId),
							new Money(0, this._localeId),
							[],
							new TimePeriod(year),
							null,
							this._localeId
					  )
					: statistics
			)
		);
	}

	wallet(walletId: string, year: number): Observable<PeriodStatistics> {
		return this._collection$.pipe(
			switchMap(collection =>
				docData(doc(collection, `${year}/year-by-wallets/${walletId}`))
			),
			map(statistics =>
				isNullish(statistics)
					? new PeriodStatistics(
							new Money(0, this._localeId),
							new Money(0, this._localeId),
							[],
							new TimePeriod(year),
							null,
							this._localeId
					  )
					: statistics
			)
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
