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
import {
	PeriodCategoryStatistics,
	PeriodStatistics,
} from './period-statistics';
import { TimePeriod } from './time-period';

export class WalletStatisticsConverter
	implements FirestoreDataConverter<PeriodStatistics>
{
	toFirestore(modelObject: any, options?: any): DocumentData {
		throw new Error('The wallet statistics are read only.');
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot<DocumentData>,
		options: SnapshotOptions
	): PeriodStatistics {
		const statistics = snapshot.data() as IWalletPeriodStatistics;
		this._convertAmountFields(statistics);

		const year = this._getYear(snapshot.ref.path);
		const root = this._convertStatistics(
			statistics,
			new TimePeriod(year),
			null
		);

		this._convertIntoInstances(statistics, root);

		return root;
	}

	private _convertAmountFields(statistics: IWalletPeriodStatistics): void {
		const fieldsToConvert: string[] = ['income', 'expenses'];

		for (const key in statistics) {
			if (Object.prototype.hasOwnProperty.call(statistics, key)) {
				const element = (statistics as any)[key];

				if (typeof element === 'object') {
					this._convertAmountFields(element);
				} else if (
					fieldsToConvert.includes(key) &&
					typeof element === 'number'
				) {
					(statistics as any)[key] = element / 100;
				}
			}
		}
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
			statistics.income,
			statistics.expenses,
			this._convertCategories(statistics.categories),
			period,
			parent
		);
	}

	private _convertCategories(
		categories: TWalletCategorizedStatistics
	): PeriodCategoryStatistics[] {
		return Object.entries(categories).map(
			([id, { income, expenses }]) =>
				new PeriodCategoryStatistics(id, income, expenses)
		);
	}
}
