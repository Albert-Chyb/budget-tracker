import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from '@angular/fire/firestore';
import {
	ITransaction,
	ITransactionBase,
	ITransactionReadPayload,
} from '../interfaces/transaction';

export class FirestoreTransactionConverter
	implements FirestoreDataConverter<ITransactionBase>
{
	toFirestore(transaction: ITransaction): DocumentData {
		const docData = {
			amount: ~~(transaction.amount * 100),
			type: transaction.type,
			date: transaction.date,
			category: transaction.category,
			wallet: transaction.wallet,
		};

		if ('description' in transaction) {
			Object.assign(docData, { description: transaction.description });
		}

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
			amount: data.amount / 100,
		};
	}
}
