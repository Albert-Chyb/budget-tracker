/**
 * Represents object in the database.
 */
export interface IWalletBase {
	name: string;
	balance: number;
}

/**
 * Represents object that is returned from a service.
 */
export interface IWallet extends IWalletBase {
	id: string;
}
