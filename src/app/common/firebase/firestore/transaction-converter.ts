import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from '@angular/fire/firestore';
import { Money } from '@common/models/money';
import {
	ITransaction,
	ITransactionBase,
	ITransactionCreatePayload,
	ITransactionReadPayload,
} from '@interfaces/transaction';

export class FirestoreTransactionConverter
	implements FirestoreDataConverter<ITransactionBase>
{
	constructor(private readonly _localeId: string) {}

	toFirestore(transaction: ITransactionCreatePayload): DocumentData {
		const docData = {
			amount: transaction.amount.asInteger,
			type: transaction.type,
			date: transaction.date,
			category: transaction.category,
			wallet: transaction.wallet,
			...('description' in transaction && {
				description: transaction.description,
			}),
		};

		return docData;
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot<ITransactionReadPayload>,
		options: SnapshotOptions
	): ITransaction {
		const data = snapshot.data();

		return {
			...data,
			id: snapshot.id,
			date: data.date.toDate(),
			amount: new Money(data.amount, this._localeId),
		};
	}
}
