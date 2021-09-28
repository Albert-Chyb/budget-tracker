export type TTransactionType = 'expense' | 'income';

export interface INewTransaction {
	amount: number;
	type: TTransactionType;
	date: Date;
	category: string;
	wallet: string;
	description?: string;
}

export interface ITransaction extends INewTransaction {
	id: string;
}
