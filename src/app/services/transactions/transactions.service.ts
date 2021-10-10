import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import {
	ITransaction,
	ITransactionBase,
	ITransactionCreatePayload,
	ITransactionReadPayload,
	ITransactionUpdatePayload,
} from 'src/app/common/interfaces/transaction';
import { UserService } from '../user/user.service';

class FirestoreTransactionConverter
	implements firebase.firestore.FirestoreDataConverter<ITransactionBase>
{
	toFirestore(transaction: ITransaction): firebase.firestore.DocumentData {
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
		snapshot: firebase.firestore.QueryDocumentSnapshot<ITransactionReadPayload>,
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
					.doc<any>(transactionRef)
					.snapshotChanges()
					.pipe(
						takeWhile(snap => snap.payload.exists),
						map(snap => snap.payload.data())
					);
			})
		);
	}

	readAll(): Observable<ITransaction[]> {
		return this._user.getUid$().pipe(
			switchMap(uid => {
				const transactionsRef = this._afStore
					.collection(`users/${uid}/transactions`)
					.ref.withConverter(this._converter);

				return this._afStore.collection<any>(transactionsRef).valueChanges();
			})
		);
	}

	async create(
		transaction: ITransactionCreatePayload
	): Promise<DocumentReference<ITransactionReadPayload>> {
		const uid = await this._user.getUid();
		const transactionsRef = this._afStore
			.collection(`users/${uid}/transactions`)
			.ref.withConverter(this._converter);

		return this._afStore.collection<any>(transactionsRef).add(transaction);
	}

	async update(
		transactionId: string,
		transaction: ITransactionUpdatePayload
	): Promise<void> {
		const uid = await this._user.getUid();
		const transactionRef = this._afStore
			.doc(`users/${uid}/transactions/${transactionId}`)
			.ref.withConverter(this._converter);

		return this._afStore.doc<any>(transactionRef).update(transaction);
	}

	async put(
		transactionId: string,
		transaction: ITransactionCreatePayload
	): Promise<void> {
		const uid = await this._user.getUid();
		const transactionRef = this._afStore
			.doc(`users/${uid}/transactions/${transactionId}`)
			.ref.withConverter(this._converter);

		return this._afStore.doc<any>(transactionRef).set(transaction);
	}

	async delete(transactionId: string): Promise<void> {
		const uid = await this._user.getUid();

		return this._afStore
			.doc(`users/${uid}/transactions/${transactionId}`)
			.delete();
	}
}
