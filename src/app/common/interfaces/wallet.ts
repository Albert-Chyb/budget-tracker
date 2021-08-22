export interface INewWallet {
	name: string;
	balance: number;
}

export interface IWallet extends INewWallet {
	id: string;
}
