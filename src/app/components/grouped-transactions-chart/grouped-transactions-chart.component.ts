import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { IWalletPeriodStatistics } from 'src/app/common/interfaces/wallet-statistics';
import { Chart } from 'src/app/common/models/chart';
import {
	StatisticsChartMonthDataset,
	StatisticsChartWeekDataset,
	StatisticsChartYearDataset,
	StatisticsDayLabelConverter,
	StatisticsMonthLabelConverter,
	StatisticsWeekLabelConverter,
} from './chart-utils';

@Component({
	selector: 'grouped-transactions-chart',
	templateUrl: './grouped-transactions-chart.component.html',
	styleUrls: ['./grouped-transactions-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedTransactionsChartComponent extends Chart<IWalletPeriodStatistics> {
	constructor() {
		super();
	}

	private _period: 'year' | 'month' | 'week';

	@Input('data')
	set data(newData: IWalletPeriodStatistics) {
		switch (this._period) {
			case 'year':
				this.changeDataset(new StatisticsChartYearDataset(newData));
				break;

			case 'month':
				this.changeDataset(new StatisticsChartMonthDataset(newData));
				break;

			case 'week':
				this.changeDataset(new StatisticsChartWeekDataset(newData));
				break;

			default:
				throw new Error('Given period is not supported');
		}
	}

	@Input('period')
	set period(period: 'year' | 'month' | 'week') {
		this._period = period;

		switch (period) {
			case 'year':
				this.changeDataset(new StatisticsChartYearDataset(this.dataset.data));
				this.changeLabels(new StatisticsMonthLabelConverter());
				break;

			case 'month':
				this.changeDataset(new StatisticsChartMonthDataset(this.dataset.data));
				this.changeLabels(new StatisticsWeekLabelConverter());

				break;

			case 'week':
				this.changeDataset(new StatisticsChartWeekDataset(this.dataset.data));
				this.changeLabels(new StatisticsDayLabelConverter());

				break;

			default:
				throw new Error('Given period is not supported');
		}
	}

	readonly chartOptions: ChartOptions = {
		maintainAspectRatio: false,
		responsive: true,
	};
}
