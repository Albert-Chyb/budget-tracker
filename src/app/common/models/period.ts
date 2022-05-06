import { isNullish } from '@common/helpers/isNullish';

export type TTimePeriodName = 'year' | 'month' | 'week' | '';
export type TTimePeriodParts = [number | null, number | null, number | null];

enum TimePeriodPartIndex {
	Year = 0,
	Month = 1,
	Week = 2,
}

const {
	Year: YearIndex,
	Month: MonthIndex,
	Week: WeekIndex,
} = TimePeriodPartIndex;

export class TimePeriod {
	private readonly _parts: TTimePeriodParts = [null, null, null];

	constructor(year?: number, month?: number, week?: number) {
		if (isNullish(year)) return;
		this.year = year;

		if (isNullish(month)) return;
		this.month = month;

		if (isNullish(week)) return;
		this.week = week;
	}

	set year(year: number) {
		this._setPart(0, year);
	}

	get year() {
		return this._parts[YearIndex];
	}

	set month(month: number) {
		if ((month >= 0 && month <= 11) || isNullish(month)) {
			this._setPart(MonthIndex, month);
		} else {
			throw new Error('The month must be a number between 0 and 11');
		}
	}

	get month() {
		return this._parts[1];
	}

	set week(week: number) {
		//TODO: Add validation based on previously set year and month;

		this._setPart(WeekIndex, week);
	}

	get week() {
		return this._parts[2];
	}

	get parts(): TTimePeriodParts {
		return [...this._parts];
	}

	get name() {
		return this._getName();
	}

	get length() {
		return this._parts.filter(part => !isNullish(part)).length;
	}

	static fromPeriod(period: TimePeriod) {
		return new TimePeriod(period.year, period.month, period.week);
	}

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

	private _resetAt(index: number) {
		for (let i = index; i < this._parts.length; i++) {
			this._parts[i] = null;
		}
	}

	private _getName(): TTimePeriodName {
		switch (this.length) {
			case 1:
				return 'year';

			case 2:
				return 'month';

			case 3:
				return 'week';

			default:
				return '';
		}
	}
}
