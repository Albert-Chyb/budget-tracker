import { formatDate } from '@angular/common';
import { capitalize } from 'src/app/common/helpers/capitalize';
import {
	IWalletPeriodStatistics,
	IWalletStatisticsAggregatedFields,
} from 'src/app/common/interfaces/wallet-statistics';
import {
	DataConverter,
	LabelConverter,
} from 'src/app/common/models/chart-base';

export abstract class TransactionsStatisticsChartDataConverter extends DataConverter<IWalletPeriodStatistics> {
	constructor(
		private readonly _transactionsType: keyof IWalletStatisticsAggregatedFields,
		readonly label: string,
		private readonly _length: number
	) {
		super(label);
	}

	convert(data: IWalletPeriodStatistics) {
		const chartData = Object.entries(data)
			.filter(([periodIndex]) => !isNaN(Number(periodIndex)))
			.reduce<{ [label: string]: number }>(
				(chartData, [periodIndex, periodStatistics]) => {
					chartData[periodIndex] = periodStatistics[this._transactionsType];

					return chartData;
				},
				{}
			);

		for (let i = 0; i < this._length; i++) {
			chartData[i] ||= 0;
		}

		return chartData;
	}
}

export class MonthlyExpensesDataConverter extends TransactionsStatisticsChartDataConverter {
	constructor() {
		super('expenses', 'Wydatki', 12);
	}
}

export class WeeklyExpensesDataConverter extends TransactionsStatisticsChartDataConverter {
	constructor() {
		super('expenses', 'Wydatki', 6);
	}
}

export class DailyExpensesDataConverter extends TransactionsStatisticsChartDataConverter {
	constructor() {
		super('expenses', 'Wydatki', 7);
	}
}

export class MonthlyIncomeDataConverter extends TransactionsStatisticsChartDataConverter {
	constructor() {
		super('income', 'Przychody', 12);
	}
}

export class WeeklyIncomeDataConverter extends TransactionsStatisticsChartDataConverter {
	constructor() {
		super('income', 'Przychody', 6);
	}
}

export class DailyIncomeDataConverter extends TransactionsStatisticsChartDataConverter {
	constructor() {
		super('income', 'Przychody', 7);
	}
}

export class WeekDayLabelConverter extends LabelConverter {
	convert(key: string): string {
		return capitalize(
			formatDate(new Date(2021, 10, +key + 1), 'cccc', 'pl-PL')
		);
	}
}

export class WeekLabelConverter extends LabelConverter {
	convert(key: string): string {
		return `Tydzień ${key}`;
	}
}

export class MonthLabelConverter extends LabelConverter {
	convert(key: string): string {
		return capitalize(formatDate(new Date(2021, +key, 1), 'LLLL', 'pl-PL'));
	}
}
