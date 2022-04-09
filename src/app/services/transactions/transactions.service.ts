import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreTransactionConverter } from '@common/firebase/firestore/transaction-converter';
import {
	ITransaction,
	ITransactionCreatePayload,
	ITransactionUpdatePayload,
} from '@interfaces/transaction';
import {
	ALL_MIXINS,
	Collection,
	Create,
	Delete,
	List,
	Put,
	Read,
	Update,
} from '@models/collection';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface Methods
	extends Read<ITransaction>,
		List<ITransaction>,
		Create<ITransactionCreatePayload, ITransaction>,
		Update<ITransactionUpdatePayload>,
		Put<ITransactionCreatePayload>,
		Delete {}

@Injectable({
	providedIn: 'root',
})
export class TransactionsService extends Collection<Methods>(...ALL_MIXINS) {
	constructor(afStore: Firestore, user: UserService) {
		super(
			afStore,
			user.getUid$().pipe(switchMap(uid => of(`users/${uid}/transactions`))),
			new FirestoreTransactionConverter()
		);
	}
}
