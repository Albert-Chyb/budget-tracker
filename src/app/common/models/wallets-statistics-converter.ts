import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from '@angular/fire/firestore';
import {
	IWalletPeriodStatistics,
	TWalletCategorizedStatistics,
} from '@interfaces/wallet-statistics';
import { Money } from './money';
import {
	PeriodCategoryStatistics,
	PeriodStatistics,
} from './period-statistics';
import { TimePeriod } from './time-period';

export class WalletStatisticsConverter
	implements FirestoreDataConverter<PeriodStatistics>
{
	constructor(private readonly _localeId: string) {}

	toFirestore(modelObject: any, options?: any): DocumentData {
		throw new Error('The wallet statistics are read only.');
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot<DocumentData>,
		options: SnapshotOptions
	): PeriodStatistics {
		const statistics = snapshot.data() as IWalletPeriodStatistics;

		const year = this._getYear(snapshot.ref.path);
		const root = this._convertStatistics(
			statistics,
			new TimePeriod(year),
			null
		);

		this._convertIntoInstances(statistics, root);

		return root;
	}

	private _convertIntoInstances(
		statistics: IWalletPeriodStatistics,
		parent: PeriodStatistics
	): void {
		for (const key in statistics) {
			if (Object.prototype.hasOwnProperty.call(statistics, key)) {
				const element = (<any>statistics)[key];

				if (!isNaN(Number(key))) {
					const statistics: IWalletPeriodStatistics = element;
					const period = TimePeriod.fromPeriod(parent.period);

					period.setNext(Number(key));

					const child = this._convertStatistics(statistics, period, parent);

					this._convertIntoInstances(statistics, child);

					parent.set(child);
				}
			}
		}
	}

	/** Retrieves the year from a document path. */
	private _getYear(path: string): number {
		// users/{uid}/wallets-statistics/{year}
		// users/{uid}/wallets-statistics/{year}/year-by-wallets/{walletID}

		return Number(path.split('/')[3]);
	}

	private _convertStatistics(
		statistics: IWalletPeriodStatistics,
		period: TimePeriod,
		parent: PeriodStatistics | null
	): PeriodStatistics {
		return new PeriodStatistics(
			new Money(statistics.income, this._localeId),
			new Money(statistics.expenses, this._localeId),
			this._convertCategories(statistics.categories),
			period,
			parent,
			this._localeId
		);
	}

	private _convertCategories(
		categories: TWalletCategorizedStatistics
	): PeriodCategoryStatistics[] {
		return Object.entries(categories).map(
			([id, { income, expenses }]) =>
				new PeriodCategoryStatistics(
					id,
					new Money(income, this._localeId),
					new Money(expenses, this._localeId)
				)
		);
	}
}
