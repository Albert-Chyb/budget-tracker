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
	constructor(
		rawStatistics: IWalletPeriodStatistics | null,
		private _dateParts: [number, number, number, number],
		public readonly name: 'year' | 'month' | 'week' | 'day'
	) {
		if (rawStatistics) {
			this._rawStatistics = rawStatistics;
			this.hasTransactions = true;
		}

		this.categories = new WalletCategorizedStatistics(
			this._rawStatistics.categories
		);
	}

	protected readonly _subPeriods: WalletStatistics[] = [];

	/** Base statistics object that is in use. */
	private readonly _rawStatistics: IWalletPeriodStatistics =
		EMPTY_PERIOD_STATISTICS;

	/** How many periods this period is splitted into. */
	length = 0;

	/** If any transactions are included in the period. */
	hasTransactions = false;

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
		return this._dateParts;
	}

	get lastPeriod() {
		return this.getPeriod(this.length - 1);
	}

	/** Returns a sub-period. */
	getPeriod(index: number): WalletStatistics {
		return this._subPeriods[index];
	}

	getNestedPeriod(...parts: number[]): WalletStatistics {
		return parts
			.filter(part => typeof part === 'number')
			.reduce<WalletStatistics>((prevStatistics, part) => {
				return prevStatistics.getPeriod(part);
			}, this);
	}

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
	constructor(rawStatistics: IWalletPeriodStatistics, year: number) {
		super(rawStatistics, [year, null, null, null], 'year');

		for (let i = 0; i < this.length; i++) {
			const rawStatistics = this.getRawPeriod(i);

			this._subPeriods.push(new WalletMonthStatistics(rawStatistics, year, i));
		}
	}

	length = 12;
}

export class WalletMonthStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		year: number,
		month: number
	) {
		super(rawStatistics, [year, month, null, null], 'month');

		for (let i = 0; i < this.length; i++) {
			const rawStatistics = this.getRawPeriod(i);

			this._subPeriods.push(
				new WalletWeekStatistics(rawStatistics, year, month, i)
			);
		}
	}

	length = this._weeksCount();

	private _weeksCount() {
		const [year, month] = this.date;

		const firstWeekDayIndex = firstDayInMonth(year, month);
		const days = numberOfDaysInMonth(year, month);

		return Math.ceil((days + firstWeekDayIndex) / 7);
	}
}

export class WalletWeekStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		year: number,
		month: number,
		week: number
	) {
		super(rawStatistics, [year, month, week, null], 'week');

		for (let i = 0; i < this.length; i++) {
			const rawStatistics = this.getRawPeriod(i);

			this._subPeriods.push(
				new WalletDayStatistics(rawStatistics, year, month, week, i)
			);
		}
	}

	length = 7;
}

export class WalletDayStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		year: number,
		month: number,
		week: number,
		day: number
	) {
		super(rawStatistics, [year, month, week, day], 'day');
	}
}
