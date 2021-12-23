import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';
import { ChartOptions } from 'chart.js';
import { Chart, LabelConverter } from 'src/app/common/models/chart-base';
import { WalletStatistics } from 'src/app/common/models/wallet-statistics';
import {
	MonthLabelConverter,
	StatisticsDataConverter,
	WeekDayLabelConverter,
	WeekLabelConverter,
} from './chart-data-converters';

type TPeriod = 'year' | 'month' | 'week';
type ConverterPair = Constructor<LabelConverter>;

const CHART_LABEL_CONVERTERS = new Map<TPeriod, ConverterPair>([
	['year', MonthLabelConverter],
	['month', WeekLabelConverter],
	['week', WeekDayLabelConverter],
]);

@Component({
	selector: 'grouped-transactions-chart',
	templateUrl: './grouped-transactions-chart.component.html',
	styleUrls: ['./grouped-transactions-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedTransactionsChartComponent
	extends Chart<WalletStatistics, 'bar'>
	implements OnInit
{
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

	ngOnInit(): void {
		this.addDataConverter(
			new StatisticsDataConverter('expenses'),
			new StatisticsDataConverter('income')
		);
	}

	@Input('period')
	set period(period: TPeriod) {
		this._period = period;
		const LabelConverter = this._retrieveLabelConverter(period);

		this.setLabelConverter(new LabelConverter());
	}
	get period() {
		return this._period;
	}

	private _retrieveLabelConverter(period: TPeriod) {
		if (CHART_LABEL_CONVERTERS.has(period)) {
			return CHART_LABEL_CONVERTERS.get(period);
		} else {
			throw new Error(`Unsupported period - (${period})`);
		}
	}
}
