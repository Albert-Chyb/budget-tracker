import { PercentageChangeComparison } from './percentage-change-comparison';
import { PeriodStatistics } from './period-statistics';

export class PrevPeriodComparison {
	constructor(private readonly _statistics: PeriodStatistics) {}

	/** Reference to the previous period object. */
	private readonly _prevPeriodStatistics: PeriodStatistics =
		this._getPrevPeriod();

	readonly expenses = new PercentageChangeComparison(
		this._prevPeriodStatistics?.expenses.asDecimal,
		this._statistics.expenses.asDecimal
	);

	readonly income = new PercentageChangeComparison(
		this._prevPeriodStatistics?.income.asDecimal,
		this._statistics.income.asDecimal
	);

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
