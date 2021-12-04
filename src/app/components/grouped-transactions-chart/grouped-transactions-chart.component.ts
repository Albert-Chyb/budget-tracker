import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';
import { ChartOptions } from 'chart.js';
import { IWalletPeriodStatistics } from 'src/app/common/interfaces/wallet-statistics';
import {
	Chart,
	DataConverter,
	LabelConverter,
} from 'src/app/common/models/chart-base';
import {
	DailyExpensesDataConverter,
	DailyIncomeDataConverter,
	MonthLabelConverter,
	MonthlyExpensesDataConverter,
	MonthlyIncomeDataConverter,
	WeekDayLabelConverter,
	WeekLabelConverter,
	WeeklyExpensesDataConverter,
	WeeklyIncomeDataConverter,
} from './chart-data-converters';

type TPeriod = 'year' | 'month' | 'week';
type ConverterPair = [
	Constructor<LabelConverter>,
	Constructor<DataConverter<IWalletPeriodStatistics>>,
	Constructor<DataConverter<IWalletPeriodStatistics>>
];

/*
!	Please note the order of the converters. First one is for labels, 
!	second one is for expenses statistics and the third one is for income statistics.
*/
const CHART_CONVERTERS_PARIS = new Map<TPeriod, ConverterPair>([
	[
		'year',
		[
			MonthLabelConverter,
			MonthlyExpensesDataConverter,
			MonthlyIncomeDataConverter,
		],
	],
	[
		'month',
		[
			WeekLabelConverter,
			WeeklyExpensesDataConverter,
			WeeklyIncomeDataConverter,
		],
	],
	[
		'week',
		[
			WeekDayLabelConverter,
			DailyExpensesDataConverter,
			DailyIncomeDataConverter,
		],
	],
]);

@Component({
	selector: 'grouped-transactions-chart',
	templateUrl: './grouped-transactions-chart.component.html',
	styleUrls: ['./grouped-transactions-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedTransactionsChartComponent extends Chart<
	IWalletPeriodStatistics,
	'bar'
> {
	readonly chartConfig: ChartOptions<'bar'> = {
		maintainAspectRatio: false,
		responsive: true,
		datasets: {
			bar: {
				borderRadius: 3,
			},
		},
	};
	private _period: TPeriod;

	@Input('period')
	set period(period: TPeriod) {
		this._period = period;
		this.removeAllDataConverters();

		const [LabelConverter, ExpensesConverter, IncomeConverter] =
			this._retrieveConverters(period);

		this.setLabelConverter(new LabelConverter());
		this.addDataConverter(new ExpensesConverter(), new IncomeConverter());
	}
	get period() {
		return this._period;
	}

	private _retrieveConverters(period: TPeriod) {
		if (CHART_CONVERTERS_PARIS.has(period)) {
			return CHART_CONVERTERS_PARIS.get(period);
		} else {
			throw new Error(`Unsupported period - (${period})`);
		}
	}
}
