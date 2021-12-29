import { firstDayInMonth, numberOfDaysInMonth } from '../helpers/date';
import {
	IWalletPeriodStatistics,
	IWalletStatisticsAggregatedFields,
	TWalletCategorizedStatistics,
} from '../interfaces/wallet-statistics';

const EMPTY_PERIOD_STATISTICS: IWalletPeriodStatistics = {
	expenses: 0,
	income: 0,
	categories: {
		'': {
			expenses: 0,
			income: 0,
		},
	},
};

export class WalletCategorizedStatistics {
	constructor(
		private readonly _rawCategorizedStatistics: TWalletCategorizedStatistics
	) {}

	category(id: string) {
		if (id in this._rawCategorizedStatistics) {
			return new WalletCategoryStatistics(
				id,
				this._rawCategorizedStatistics[id]
			);
		} else {
			throw new Error('No category with given id.');
		}
	}

	*[Symbol.iterator]() {
		for (const categoryId in this._rawCategorizedStatistics) {
			if (
				Object.prototype.hasOwnProperty.call(
					this._rawCategorizedStatistics,
					categoryId
				)
			) {
				yield this.category(categoryId);
			}
		}
	}
}

export class WalletCategoryStatistics {
	constructor(
		private readonly _id: string,
		private readonly _rawCategoryStatistics: IWalletStatisticsAggregatedFields
	) {}

	get expenses(): number {
		return this._rawCategoryStatistics.expenses;
	}

	get income(): number {
		return this._rawCategoryStatistics.income;
	}

	get difference(): number {
		return this.income - this.expenses;
	}

	get id(): string {
		return this._id;
	}
}

export abstract class WalletStatistics {
	constructor(rawStatistics: IWalletPeriodStatistics | null) {
		if (rawStatistics) {
			this._rawStatistics = rawStatistics;
			this.hasTransactions = false;
		}

		this.categories = new WalletCategorizedStatistics(
			this._rawStatistics.categories
		);
	}

	/** Base statistics object that is in use. */
	private readonly _rawStatistics: IWalletPeriodStatistics =
		EMPTY_PERIOD_STATISTICS;

	/**
	 * Information about the period date.
	 * It includes year, month, week, and day in that order.
	 */
	protected periodParts: [number, number, number, number] = [
		null,
		null,
		null,
		null,
	];

	/** How many periods this period is splitted into. */
	length = 0;

	/** If any transactions are included in the period. */
	hasTransactions = true;

	categories: WalletCategorizedStatistics;

	get income(): number {
		return this._rawStatistics.income;
	}

	get expenses(): number {
		return this._rawStatistics.expenses;
	}

	get difference(): number {
		return this.income - this.expenses;
	}

	get date() {
		return this.periodParts;
	}

	get lastPeriod() {
		return this.getPeriod(this.length - 1);
	}

	/** Returns a sub-period. */
	abstract getPeriod(index: number): WalletStatistics;

	protected getRawPeriod(index: number): IWalletPeriodStatistics {
		return (<any>this._rawStatistics)?.[String(index)];
	}

	*[Symbol.iterator]() {
		for (let i = 0; i < this.length; i++) {
			yield this.getPeriod(i);
		}
	}
}

export class WalletYearStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		private readonly year: number
	) {
		super(rawStatistics);

		this.periodParts = [year, null, null, null];
	}

	length = 12;

	getPeriod(month: number) {
		return new WalletMonthStatistics(
			this.getRawPeriod(month),
			this.year,
			month
		);
	}
}

export class WalletMonthStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		private readonly year: number,
		private readonly month: number
	) {
		super(rawStatistics);

		this.periodParts = [year, month, null, null];
	}

	length = this._weekCount();

	getPeriod(week: number) {
		return new WalletWeekStatistics(
			this.getRawPeriod(week),
			this.year,
			this.month,
			week
		);
	}

	private _weekCount() {
		const firstWeekDayIndex = firstDayInMonth(this.year, this.month);
		const days = numberOfDaysInMonth(this.year, this.month);

		return Math.ceil((days + firstWeekDayIndex) / 7);
	}
}

export class WalletWeekStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		private readonly year: number,
		private readonly month: number,
		private readonly week: number
	) {
		super(rawStatistics);

		this.periodParts = [year, month, week, null];
	}

	length = 7;

	getPeriod(day: number) {
		return new WalletDayStatistics(
			this.getRawPeriod(day),
			this.year,
			this.month,
			this.week,
			day
		);
	}
}

export class WalletDayStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		private readonly year: number,
		private readonly month: number,
		private readonly week: number,
		private readonly day: number
	) {
		super(rawStatistics);

		this.periodParts = [year, month, week, day];
	}

	length = 0;

	/** CAUTION ! The day is not splitted into smaller periods. */
	getPeriod(index: number) {
		return this;
	}
}
