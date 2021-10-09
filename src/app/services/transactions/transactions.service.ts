import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import {
	IRawFirestoreTransaction,
	ITransaction,
	ITransactionBase,
} from 'src/app/common/interfaces/transaction';
import { UserService } from '../user/user.service';

class FirestoreTransactionConverter
	implements firebase.firestore.FirestoreDataConverter<ITransactionBase>
{
	toFirestore(transaction: ITransactionBase): ITransactionBase {
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
		snapshot: firebase.firestore.QueryDocumentSnapshot<IRawFirestoreTransaction>,
		options: firebase.firestore.SnapshotOptions
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

@Injectable({
	providedIn: 'root',
})
export class TransactionsService {
	constructor(
		private readonly _user: UserService,
		private readonly _afStore: AngularFirestore
	) {}

	private readonly _converter = new FirestoreTransactionConverter();

	read(transactionId: string): Observable<ITransaction> {
		return this._user.getUid$().pipe(
			switchMap(uid => {
				const transactionRef = this._afStore
					.doc(`users/${uid}/transactions/${transactionId}`)
					.ref.withConverter(this._converter);

				return this._afStore
					.doc(transactionRef)
					.snapshotChanges()
					.pipe(
						takeWhile(snap => snap.payload.exists),
						map(snap => snap.payload.data())
					);
			})
		) as any;
	}

	readAll(): Observable<ITransaction[]> {
		return this._user.getUid$().pipe(
			switchMap(uid => {
				const transactionsRef = this._afStore
					.collection<IRawFirestoreTransaction>(`users/${uid}/transactions`)
					.ref.withConverter(this._converter);

				return this._afStore
					.collection<IRawFirestoreTransaction>(transactionsRef)
					.valueChanges();
			})
		) as any;
	}

	async create(transaction: ITransactionBase) {
		const uid = await this._user.getUid();
		const transactionsRef = this._afStore
			.collection<IRawFirestoreTransaction>(`users/${uid}/transactions`)
			.ref.withConverter(this._converter);

		return this._afStore
			.collection<IRawFirestoreTransaction>(transactionsRef)
			.add(transaction as any);
	}

	async update(transactionId: string, transaction: Partial<ITransactionBase>) {
		const uid = await this._user.getUid();
		const transactionRef = this._afStore
			.doc<IRawFirestoreTransaction>(
				`users/${uid}/transactions/${transactionId}`
			)
			.ref.withConverter(this._converter);

		return this._afStore
			.doc<IRawFirestoreTransaction>(transactionRef)
			.update(transaction as any);
	}

	async put(transactionId: string, transaction: ITransactionBase) {
		const uid = await this._user.getUid();
		const transactionRef = this._afStore
			.doc<IRawFirestoreTransaction>(
				`users/${uid}/transactions/${transactionId}`
			)
			.ref.withConverter(this._converter);

		return this._afStore
			.doc<IRawFirestoreTransaction>(transactionRef)
			.set(transaction as any);
	}

	async delete(transactionId: string) {
		const uid = await this._user.getUid();

		return this._afStore
			.doc<IRawFirestoreTransaction>(
				`users/${uid}/transactions/${transactionId}`
			)
			.delete();
	}
}
