import { Timestamp } from './firestore';

export type TTransactionType = 'expense' | 'income';

/**
 * Represents object in the database.
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
 * It is basically a transaction base but with unconverted date field, just for type checking sake.
 */
export interface IRawFirestoreTransaction
	extends Omit<ITransactionBase, 'date'> {
	date: Timestamp;
}

/**
 * Represents object that is returned from a service.
 */
export interface ITransaction extends ITransactionBase {
	id: string;
}
