export type TTransactionType = 'expense' | 'income';

/**
 * Interface that represents a transaction object stored in the database.
 */

export interface ITransactionBase {
	amount: number;
	type: TTransactionType;
	date: Date;
	category: string;
	wallet: string;
	description?: string;
}

/** Interface that represents a transaction that is exposed to the app. */

export interface ITransaction extends ITransactionBase {
	id: string;
}
