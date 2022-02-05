import { WalletStatistics } from './wallet-statistics';

export class PrevPeriodComparison {
	constructor(private readonly _period: WalletStatistics) {
		const prevPeriod = this._getPrevPeriod();

		this.prevPeriod = prevPeriod;
		this.prevPeriodExists = prevPeriod !== null;

		if (this.prevPeriodExists) {
			this.expensesPercentageChange = this._percentageChange(
				this._period.expenses,
				this.prevPeriod.expenses
			);

			this.incomePercentageChange = this._percentageChange(
				this._period.income,
				this.prevPeriod.income
			);
		}
	}

	/** Reference to the previous period object. */
	readonly prevPeriod: WalletStatistics;

	/** If the previous period is outside of the current year. */
	readonly prevPeriodExists: boolean;

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
		if (prevValue === null || !this.prevPeriodExists) {
			return null;
		}

		const delta = newValue - prevValue;

		return prevValue === 0 ? 0 : delta / prevValue;
	}

	private _getPrevPeriod() {
		const [, month, week] = this._period.date;
		let prevPeriodStatistics: WalletStatistics = null;

		switch (this._period.name) {
			case 'month':
				if (month > 0) {
					prevPeriodStatistics = this._period.parent.getPeriod(month - 1);
				}
				break;

			case 'week':
				if (month > 0 && week - 1 < 0) {
					// If the previous week is outside of the month.
					prevPeriodStatistics = this._period.parent.parent.getPeriod(
						month - 1
					).lastPeriod;
				} else if (week > 0) {
					// If the previous week is within the month.
					prevPeriodStatistics = this._period.parent.getPeriod(week - 1);
				}
				break;
		}

		return prevPeriodStatistics;
	}
}
