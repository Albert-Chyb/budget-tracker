import {
	IWalletPeriodStatistics,
	TWalletCategorizedStatistics,
} from '../interfaces/wallet-statistics';

const EMPTY_WALLET_STATISTICS: IWalletPeriodStatistics = {
	expenses: 0,
	income: 0,
	categories: {
		'': {
			expenses: 0,
			income: 0,
		},
	},
};

export class WalletStatistics {
	private readonly _rawStatistics: IWalletPeriodStatistics =
		EMPTY_WALLET_STATISTICS;

	constructor(rawStatistics: IWalletPeriodStatistics | null) {
		if (rawStatistics) {
			this._rawStatistics = rawStatistics;
		}
	}

	get income(): number {
		return this._rawStatistics.income;
	}

	get expenses(): number {
		return this._rawStatistics.expenses;
	}

	get difference(): number {
		return this.income - this.expenses;
	}

	get categories(): TWalletCategorizedStatistics {
		return this._rawStatistics.categories;
	}

	get raw() {
		return this._rawStatistics;
	}

	getPeriod(index: number): WalletStatistics {
		const periodStatistics = (<any>this._rawStatistics)[
			String(index)
		] as IWalletPeriodStatistics;

		return new WalletStatistics(periodStatistics);
	}
}
