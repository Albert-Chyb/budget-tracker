import { isNullish } from '@common/helpers/isNullish';
import { PeriodStatistics } from './period-statistics';

export class PrevPeriodComparison {
	constructor(private readonly _statistics: PeriodStatistics) {
		const prevPeriodStatistics = this._getPrevPeriod();

		this.prevPeriodStatistics = prevPeriodStatistics;
		this.prevPeriodStatisticsExists = !isNullish(prevPeriodStatistics);

		if (this.prevPeriodStatisticsExists) {
			this.expensesPercentageChange = this._percentageChange(
				this._statistics.expenses,
				this.prevPeriodStatistics.expenses
			);

			this.incomePercentageChange = this._percentageChange(
				this._statistics.income,
				this.prevPeriodStatistics.income
			);
		}
	}

	/** Reference to the previous period object. */
	readonly prevPeriodStatistics: PeriodStatistics;

	/** If the previous period is outside of the current year. */
	readonly prevPeriodStatisticsExists: boolean;

	readonly expensesPercentageChange: number;

	readonly incomePercentageChange: number;

	/**
	 * Calculates percentage change.
	 * @param newValue Current value
	 * @param prevValue Older value
	 * @returns Percentage change
	 */
	private _percentageChange(
		newValue: number,
		prevValue: number | null
	): number {
		if (prevValue === null || !this.prevPeriodStatisticsExists) {
			return null;
		}

		const delta = newValue - prevValue;

		return prevValue === 0 ? 0 : delta / prevValue;
	}

	private _getPrevPeriod(): PeriodStatistics {
		const [, month, week] = this._statistics.period.parts;
		let prevPeriodStatistics: PeriodStatistics;

		switch (this._statistics.period.name) {
			case 'month':
				if (month > 0) {
					prevPeriodStatistics = this._statistics.parent.get(month - 1);
				}
				break;

			case 'week':
				if (month > 0 && week - 1 < 0) {
					// If the previous week is outside of the month.
					prevPeriodStatistics = this._statistics.parent.parent.get(
						month - 1
					).lastPeriod;
				} else if (week > 0) {
					// If the previous week is within the month.
					prevPeriodStatistics = this._statistics.parent.get(week - 1);
				}
				break;
		}

		return prevPeriodStatistics;
	}
}
