import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import {
	ITransactionBase,
	ITransaction,
} from 'src/app/common/interfaces/transaction';
import firebase from 'firebase/app';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class TransactionsService {
	constructor(
		private readonly _user: UserService,
		private readonly _afStore: AngularFirestore
	) {}

	read(transactionId: string) {
		return this._user.getUid$().pipe(
			switchMap(uid =>
				this._afStore
					.doc<ITransaction>(`users/${uid}/transactions/${transactionId}`)
					.snapshotChanges()
					.pipe(
						takeWhile(snap => snap.payload.exists),
						map(snap => ({ id: snap.payload.id, ...snap.payload.data() })),
						map(this._transformTimestampToDate)
					)
			)
		);
	}

	readAll() {
		return this._user.getUid$().pipe(
			switchMap(uid =>
				this._afStore
					.collection<ITransaction>(`users/${uid}/transactions`)
					.valueChanges({ idField: 'id' })
					.pipe(
						map(transactions =>
							transactions.map(this._transformTimestampToDate)
						)
					)
			)
		);
	}

	async create(transaction: ITransactionBase) {
		const uid = await this._user.getUid();

		return this._afStore
			.collection<ITransaction>(`users/${uid}/transactions`)
			.add(transaction as any);
	}

	async update(transactionId: string, transaction: Partial<ITransactionBase>) {
		const uid = await this._user.getUid();

		return this._afStore
			.doc<ITransaction>(`users/${uid}/transactions/${transactionId}`)
			.update(transaction as any);
	}

	async delete(transactionId: string) {
		const uid = await this._user.getUid();

		return this._afStore
			.doc<ITransaction>(`users/${uid}/transactions/${transactionId}`)
			.delete();
	}

	/**
	 * Transforms firestore timestamp to a Date object.
	 */
	private _transformTimestampToDate(transaction: ITransaction) {
		const timestamp: firebase.firestore.Timestamp = transaction.date as any;

		transaction.date = timestamp.toDate();

		return transaction;
	}
}
