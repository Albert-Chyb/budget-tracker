import { Timestamp } from './firestore';

export type TTransactionType = 'expense' | 'income';

/**
 * General shape of a transaction object.
 */
export interface ITransactionBase {
	amount: number;
	type: TTransactionType;
	category: string;
	wallet: string;
	description?: string;
	date: Date | Timestamp;
}

/**
 * Represents an object that is returned from a service.
 */
export interface ITransaction extends ITransactionBase {
	id: string;
	date: Date;
}

/**
 * Represents an object that aims to create a new transaction in the database.
 */
export interface ITransactionCreatePayload extends ITransactionBase {
	date: Date;
}

/**
 * Represents an object that aims to update already existing transaction in the database.
 */
export interface ITransactionUpdatePayload extends Partial<ITransactionBase> {
	date: Date;
}

/**
 * Represents a raw object that is returned from the database.
 */
export interface ITransactionReadPayload extends ITransactionBase {
	date: Timestamp;
}
