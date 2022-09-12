import { Timestamp } from '@angular/fire/firestore';
import { Money } from '@common/models/money';

export type TTransactionType = 'expense' | 'income';

/**
 * Represents a general transaction object.
 */
export interface ITransactionBase {
	amount: Money | number;
	type: TTransactionType;
	category: string;
	wallet: string;
	description?: string;
	date: Date | Timestamp;
}

/**
 * Represents a transaction object that is returned from a service.
 */
export interface ITransaction extends ITransactionBase {
	id: string;
	date: Date;
	amount: Money;
}

/**
 * Represents an object that aims to create a new transaction in the database.
 */
export interface ITransactionCreatePayload extends ITransactionBase {
	date: Date;
	amount: Money;
}

/**
 * Represents an object that aims to update already existing transaction in the database.
 */
export interface ITransactionUpdatePayload extends Partial<ITransactionBase> {
	date: Date;
	amount: Money;
}

/**
 * Represents a raw transaction object that is returned from the database.
 */
export interface ITransactionReadPayload extends ITransactionBase {
	date: Timestamp;
	amount: number;
}
