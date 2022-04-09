import { formatDate } from '@angular/common';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';
import {
	IWalletPeriodStatistics,
	IWalletStatisticsAggregatedFields,
	TWalletCategorizedStatistics,
} from '@interfaces/wallet-statistics';

const EMPTY_PERIOD_STATISTICS: Readonly<IWalletPeriodStatistics> = {
	expenses: 0,
	income: 0,
	categories: {
		'': {
			expenses: 0,
			income: 0,
		},
	},
};

const PERIODS_NAMES: Readonly<['year', 'month', 'week', 'day']> = [
	'year',
	'month',
	'week',
	'day',
];

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
		public readonly index: number,
		private readonly _parent: WalletStatistics | null,
		SubPeriodConstructor: Constructor<WalletStatistics>,
		public readonly length: number
	) {
		this._rawStatistics = rawStatistics ?? EMPTY_PERIOD_STATISTICS;

		this.categories = new WalletCategorizedStatistics(
			this._rawStatistics.categories
		);

		if (SubPeriodConstructor) {
			for (let i = 0; i < this.length; i++) {
				this._subPeriods.push(
					new SubPeriodConstructor(this.getRawPeriod(i), this, i)
				);
			}
		}
	}

	/** Array of sub periods. */
	protected readonly _subPeriods: WalletStatistics[] = [];

	/** Base statistics object that is in use by this object instance. */
	private readonly _rawStatistics: IWalletPeriodStatistics;

	/** Statistics in categories of this period. */
	categories: WalletCategorizedStatistics;

	private readonly _date: number[] = [this.index];

	get date(): number[] {
		return !!this._parent ? [...this._parent.date, this.index] : this._date;
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

	get lastPeriod() {
		return this.getPeriod(this.length - 1);
	}

	get name(): 'year' | 'month' | 'week' | 'day' {
		return PERIODS_NAMES[this.date.length - 1];
	}

	/** If any transactions are included in the period. */
	get hasTransactions() {
		return Number(Boolean(this.expenses)) + Number(Boolean(this.income)) !== 0;
	}

	get parent() {
		return this._parent;
	}

	/** Returns a sub-period. */
	getPeriod(index: number): WalletStatistics {
		if (index >= this.length) {
			throw new Error('Tried to access a period outside of the range.');
		}

		if (index < 0) {
			throw new Error('The index cannot have negative value.');
		}

		return this._subPeriods[index];
	}

	/**
	 * Returns nested period.
	 *
	 * @example
	 * // For example this:
	 * year.getPeriod(month).getPeriod(week).getPeriod(day)
	 *
	 * // returns the same period as this code:
	 * year.getNestedPeriod(month, week, day)
	 */
	getNestedPeriod(...parts: number[]): WalletStatistics {
		return parts
			.filter(part => typeof part === 'number')
			.reduce<WalletStatistics>(
				(prevStatistics, part) => prevStatistics.getPeriod(part),
				this
			);
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
		super(rawStatistics, year, null, WalletMonthStatistics, 12);
	}
}

export class WalletMonthStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		parent: WalletYearStatistics,
		month: number
	) {
		super(
			rawStatistics,
			month,
			parent,
			WalletWeekStatistics,
			Number(formatDate(new Date(parent.index, month + 1, 0), 'W', 'pl-PL'))
		);
	}
}

export class WalletWeekStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		parent: WalletMonthStatistics,
		week: number
	) {
		super(rawStatistics, week, parent, WalletDayStatistics, 7);
	}
}

export class WalletDayStatistics extends WalletStatistics {
	constructor(
		rawStatistics: IWalletPeriodStatistics,
		parent: WalletWeekStatistics,
		day: number
	) {
		super(rawStatistics, day, parent, null, 0);
	}
}
