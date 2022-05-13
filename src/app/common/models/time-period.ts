import { formatDate } from '@angular/common';
import { isBetween } from '@common/helpers/isBetween';
import { isNullish } from '@common/helpers/isNullish';

export type TTimePeriodName = 'year' | 'month' | 'week' | 'day';
export type TTimePeriodParts = [
	number | null,
	number | null,
	number | null,
	number | null
];

enum TimePeriodPartIndex {
	Year = 0,
	Month = 1,
	Week = 2,
	Day = 3,
}

const {
	Year: YearIndex,
	Month: MonthIndex,
	Week: WeekIndex,
	Day: DayIndex,
} = TimePeriodPartIndex;

export class TimePeriod {
	/** Parts of the period. */
	private readonly _parts: TTimePeriodParts = [null, null, null, null];

	constructor(year?: number, month?: number, week?: number, day?: number) {
		if (isNullish(year)) return;
		this.year = year;

		if (isNullish(month)) return;
		this.month = month;

		if (isNullish(week)) return;
		this.week = week;

		if (isNullish(day)) return;
		this.day = day;
	}

	/** Sets the year. */
	set year(year: number) {
		if (year > 0 || isNullish(year)) {
			this._setPart(YearIndex, year);
		} else {
			throw new Error('The year has to be grater than 0.');
		}
	}
	/** Gets the year. */
	get year() {
		return this._parts[YearIndex];
	}

	/** Sets the month index. */
	set month(month: number) {
		if (isBetween(month, 0, 11) || isNullish(month)) {
			this._setPart(MonthIndex, month);
		} else {
			throw new Error('The month must be a number between 0 and 11');
		}
	}
	/** Gets the month index */
	get month() {
		return this._parts[MonthIndex];
	}

	/** Sets the week index, relatively to the month. */
	set week(week: number) {
		const numberOfWeeks = Number(
			formatDate(new Date(this.year, this.month + 1, 0), 'W', 'pl-PL')
		);

		if (isBetween(week, 0, numberOfWeeks - 1) || isNullish(week)) {
			this._setPart(WeekIndex, week);
		} else {
			throw new Error(
				`The week index must be a number between ${0} and ${numberOfWeeks}.`
			);
		}
	}

	/** Gets the week index. */
	get week() {
		return this._parts[WeekIndex];
	}

	/** Sets the day index relatively to the week. */
	set day(day: number) {
		if (isBetween(day, 0, 6) || isNullish(day)) {
			this._setPart(DayIndex, day);
		} else {
			throw new Error(`The day index must be a number between 0 and 6.`);
		}
	}
	/** Gets the day index. */
	get day() {
		return this._parts[DayIndex];
	}

	/** Returns the array with period parts. */
	get parts(): TTimePeriodParts {
		return [...this._parts];
	}

	/** Returns the name of the current period. */
	get name() {
		return this._getName();
	}

	/** Returns how many parts of the period are set. */
	get length() {
		return this._parts.filter(part => !isNullish(part)).length;
	}

	/**
	 * Sets next available period part.
	 * @param value Valid period part.
	 */
	setNext(value: number): void {
		switch (this.length) {
			case 0:
				this.year = value;
				break;

			case 1:
				this.month = value;
				break;

			case 2:
				this.week = value;
				break;

			case 3:
				this.day = value;
				break;

			default:
				throw new Error('There are not empty period parts left to be set.');
		}
	}

	/**
	 * Checks if the passed period is a direct sub period of this one.
	 * @param period A sub period
	 */
	isSubPeriod(period: TimePeriod): boolean {
		// 1. A sub period has to have one more part than the parent period.
		if (period.length !== this.length + 1) {
			return false;
		}

		// 2. Both periods should have the same not nullish elements.
		if (
			!this._parts
				.slice(0, this.length)
				.every((value, index) => value === period.parts[index])
		) {
			return false;
		}

		return true;
	}

	/** Returns the count of the sub periods in this period. */
	calculateSubPeriodsCount(): number {
		switch (this._getName()) {
			case 'year':
				return 12;

			case 'month':
				return Number(
					formatDate(new Date(this.year, this.month + 1, 0), 'W', 'pl-PL')
				);

			case 'week':
				return 7;

			default:
				return 0;
		}
	}

	/**
	 * Creates a new period object from the received period.
	 * @param period Instance of a TimePeriod class.
	 * @returns New instance of the TimePeriod class.
	 */
	static fromPeriod(period: TimePeriod) {
		return new TimePeriod(period.year, period.month, period.week, period.day);
	}

	/** Sets the value at the given index. If it cannot be set, it throws an error. */
	private _setPart(index: number, value: number) {
		if (isNullish(value)) {
			return this._resetAt(index);
		}

		if (typeof value !== 'number') {
			throw new Error('Period part should be a number.');
		}

		if (index !== 0 && isNullish(this._parts[index - 1])) {
			throw new Error('You did not set the last period part.');
		}

		this._parts[index] = value;
	}

	/** Resets the element at the given index, and all the elements that follows it. */
	private _resetAt(index: number) {
		for (let i = index; i < this._parts.length; i++) {
			this._parts[i] = null;
		}
	}

	/** Returns the name of the period. */
	private _getName(): TTimePeriodName {
		switch (this.length) {
			case 1:
				return 'year';

			case 2:
				return 'month';

			case 3:
				return 'week';

			case 4:
				return 'day';

			default:
				return null;
		}
	}
}
