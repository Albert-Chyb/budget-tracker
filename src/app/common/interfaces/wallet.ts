import { Money } from '@common/models/money';

/**
 * Represents a general wallet object.
 */
export interface IWalletBase {
	name: string;
	balance: Money;
}

/**
 * Represents a wallet object that is returned from a service.
 */
export interface IWallet extends IWalletBase {
	id: string;
}

/**
 * Represents an object that aims to create a new wallet in the database.
 */
export interface IWalletCreatePayload extends IWalletBase {}

/**
 * Represents an object that aims to update already existing wallet in the database.
 */
export interface IWalletUpdatePayload extends Pick<IWalletBase, 'name'> {}

/**
 * Represents a wallet object that is returned from the database.
 */
export interface IWalletReadPayload {
	name: string;
	balance: number;
}
