import { isNullish } from '@common/helpers/isNullish';
import { TimePeriod } from '@common/models/time-period';

export class PeriodCategories {
	constructor(categories: PeriodCategoryStatistics[]) {
		this._categoriesMap = new Map(
			categories.map(category => [category.id, category])
		);
	}

	private readonly _categoriesMap: Map<string, PeriodCategoryStatistics>;

	/** Returns a category with given id. Throws an error if the category does not exist. */
	category(id: string): PeriodCategoryStatistics {
		if (!this.has(id)) {
			throw new Error('There is not a category with given id.');
		}

		return this._categoriesMap.get(id);
	}

	/** Checks if there is a category with given id. */
	has(id: string): boolean {
		return this._categoriesMap.has(id);
	}

	[Symbol.iterator]() {
		return this._categoriesMap.values();
	}
}

export class PeriodCategoryStatistics {
	constructor(
		public readonly id: string,
		public readonly income: number,
		public readonly expenses: number
	) {}

	get difference() {
		return this.income - this.expenses;
	}
}

export class PeriodStatistics {
	constructor(
		public readonly income: number,
		public readonly expenses: number,
		categoriesArray: PeriodCategoryStatistics[],
		private readonly _period: TimePeriod,
		public readonly parent: PeriodStatistics | null
	) {
		this._subPeriods = this._generateEmptySubPeriods(
			this._period.calculateSubPeriodsCount()
		);

		this.categories = new PeriodCategories(categoriesArray);
	}

	private readonly _subPeriods: PeriodStatistics[];

	readonly categories: PeriodCategories;

	/**
	 * Inserts a statistics object as a sub period at the proper place.
	 * @param statistics The statistics of a sub period.
	 */
	set(statistics: PeriodStatistics): void {
		if (!this.period.isSubPeriod(statistics.period)) {
			throw new Error(
				'The child period statistics object is not a direct child.'
			);
		}

		const index = statistics.period.parts[this._period.length];

		this._subPeriods[index] = statistics;
	}

	/**
	 * Gets a sub period at passed index.
	 */
	get(index: number): PeriodStatistics {
		if (index >= this._subPeriods.length) {
			throw new Error(
				'Tried to access a period`s statistics outside of the range.'
			);
		}

		if (index < 0) {
			throw new Error('The index cannot have negative value.');
		}

		return this.subPeriods[index];
	}

	getNested(...parts: number[]): PeriodStatistics {
		return parts
			.filter(part => !isNullish(part))
			.reduce<PeriodStatistics>(
				(periodStats, part) => periodStats.get(part),
				this
			);
	}

	/** Returns sub periods statistics of this period. */
	get subPeriods(): PeriodStatistics[] {
		return [...this._subPeriods];
	}

	/** Gets the period that this statistics are part of. */
	get period(): TimePeriod {
		return TimePeriod.fromPeriod(this._period);
	}

	/** Difference between income and expenses. */
	get difference(): number {
		return this.income - this.expenses;
	}

	get hasTransactions(): boolean {
		return this.expenses > 0 || this.income > 0;
	}

	get hasSubPeriods(): boolean {
		return this._subPeriods.length > 0;
	}

	get lastPeriod(): PeriodStatistics {
		const subPeriods = this.subPeriods;

		return subPeriods[subPeriods.length - 1];
	}

	*[Symbol.iterator]() {
		for (let subPeriod of this._subPeriods) {
			yield subPeriod;
		}
	}

	/** Generates an array of empty period with given length. */
	private _generateEmptySubPeriods(length: number): PeriodStatistics[] {
		return new Array(length).fill(0).map((_, index) => {
			const timePeriod = TimePeriod.fromPeriod(this.period);
			timePeriod.setNext(index);

			return new PeriodStatistics(0, 0, [], timePeriod, this);
		});
	}
}
