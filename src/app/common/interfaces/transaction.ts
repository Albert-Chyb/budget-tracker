import firebase from 'firebase/app';

export type TTransactionType = 'expense' | 'income';

/**
 * Interface that represents a transaction object stored in the database.
 * It is a reference for all object that aim to make any changes to the data on the server.
 */
export interface ITransactionBase {
	amount: number;
	type: TTransactionType;
	date: Date;
	category: string;
	wallet: string;
	description?: string;
}

/**
 * Interface that represents a transaction object that is returned from the firestore.
 * It contains unconverted values (such as Timestamp) just for type checking sake.
 */
export interface IRawFirestoreTransaction
	extends Omit<ITransactionBase, 'date'> {
	date: firebase.firestore.Timestamp;
}

/**
 * Interface that represents a transaction that is exposed to the app.
 */
export interface ITransaction extends ITransactionBase {
	id: string;
}
