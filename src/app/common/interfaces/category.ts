import { TTransactionType } from '@interfaces/transaction';

/**
 * Represents a transaction object that is returned from a service.
 */
export interface ICategory extends ICategoryBase {
	id: string;
}

/**
 * Represents a general category object.
 */
export interface ICategoryBase {
	name: string;
	icon: string;
	defaultTransactionsType: TTransactionType;
}

/**
 * Represents an object that aims to create a new category in the database.
 */
export interface ICategoryCreatePayload extends ICategoryBase {}

/**
 * Represents an object that aims to update already existing category in the database.
 */
export interface ICategoryUpdatePayload extends Partial<ICategoryBase> {}

/**
 * Represents a raw category object that is returned from the database.
 */
export interface ICategoryReadPayload extends ICategoryBase {}
