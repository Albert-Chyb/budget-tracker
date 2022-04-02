import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SetOptions,
	SnapshotOptions,
} from '@angular/fire/firestore';
import { IWalletPeriodStatistics } from '../interfaces/wallet-statistics';

export class WalletStatisticsConverter
	implements FirestoreDataConverter<IWalletPeriodStatistics>
{
	toFirestore(modelObject: IWalletPeriodStatistics): DocumentData;
	toFirestore(
		modelObject: Partial<IWalletPeriodStatistics>,
		options: SetOptions
	): DocumentData;
	toFirestore(modelObject: any, options?: any): DocumentData {
		throw new Error('The wallet statistics are read only.');
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot<DocumentData>,
		options: SnapshotOptions
	): IWalletPeriodStatistics {
		const statistics = snapshot.data() as IWalletPeriodStatistics;

		this._convert(statistics);

		return statistics;
	}

	private _convert(statistics: IWalletPeriodStatistics): void {
		const fieldsToConvert: string[] = ['income', 'expenses'];

		for (const key in statistics) {
			if (Object.prototype.hasOwnProperty.call(statistics, key)) {
				const element = (statistics as any)[key];

				if (typeof element === 'object') {
					this._convert(element);
				} else if (
					fieldsToConvert.includes(key) &&
					typeof element === 'number'
				) {
					(statistics as any)[key] = element / 100;
				}
			}
		}
	}
}
