import { formatDate } from '@angular/common';
import { capitalize } from 'src/app/common/helpers/capitalize';
import {
	addDays,
	beginningOfWeek,
	firstDayInMonth,
} from 'src/app/common/helpers/date';
import { IWalletStatisticsAggregatedFields } from 'src/app/common/interfaces/wallet-statistics';
import {
	DataConverter,
	LabelConverter,
	TChartData,
} from 'src/app/common/models/chart-base';
import { WalletStatistics } from 'src/app/common/models/wallet-statistics';

export class StatisticsDataConverter extends DataConverter<WalletStatistics> {
	constructor(
		private readonly _transactionsType: keyof IWalletStatisticsAggregatedFields
	) {
		super(_transactionsType === 'expenses' ? 'Wydatki' : 'Przychody');
	}

	convert(statistics: WalletStatistics) {
		return Array.from(statistics).reduce<TChartData>(
			(chartData, subPeriodStatistics) => {
				chartData[subPeriodStatistics.date.join('-')] =
					subPeriodStatistics[this._transactionsType];

				return chartData;
			},
			{}
		);
	}
}

export class WeekDayLabelConverter extends LabelConverter {
	constructor(private readonly _locale: string) {
		super();
	}

	convert(date: string): string {
		const [year, month, week, day] = date.split('-').map(d => +d);
		const offset = week === 0 ? firstDayInMonth(year, month) : 0;

		return capitalize(
			formatDate(
				addDays(beginningOfWeek(year, month, week), day - offset),
				'cccc',
				this._locale
			)
		);
	}
}

export class WeekLabelConverter extends LabelConverter {
	constructor(private readonly _locale: string) {
		super();
	}

	convert(date: string): string {
		const [, , week] = date.split('-').map(d => +d);

		return `Tydzień ${week + 1}`;
	}
}

export class MonthLabelConverter extends LabelConverter {
	constructor(private readonly _locale: string) {
		super();
	}

	convert(date: string): string {
		const [year, month] = date.split('-').map(d => +d);

		return capitalize(
			formatDate(new Date(year, month, 1), 'LLLL', this._locale)
		);
	}
}
