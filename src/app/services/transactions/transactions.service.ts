import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
	ITransaction,
	ITransactionCreatePayload,
	ITransactionUpdatePayload,
} from 'src/app/common/interfaces/transaction';
import {
	ALL_MIXINS,
	Collection,
	Create,
	Delete,
	List,
	Put,
	Read,
	Update,
} from 'src/app/common/models/collection';
import { FirestoreTransactionConverter } from 'src/app/common/models/firestore-transaction-converter';
import { UserService } from '../user/user.service';

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
