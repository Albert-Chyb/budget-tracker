import { formatDate } from '@angular/common';
import { capitalize } from 'src/app/common/helpers/capitalize';
import { IWalletPeriodStatistics } from 'src/app/common/interfaces/wallet-statistics';
import { ChartDataset, ChartLabelConverter } from 'src/app/common/models/chart';

export class StatisticsMonthLabelConverter extends ChartLabelConverter<IWalletPeriodStatistics> {
	convert(index: number): string {
		return capitalize(formatDate(new Date(2021, index, 1), 'LLLL', 'pl-PL'));
	}
}

export class StatisticsWeekLabelConverter extends ChartLabelConverter<IWalletPeriodStatistics> {
	convert(index: number): string {
		return `Tydzień ${index + 1}`;
	}
}

export class StatisticsDayLabelConverter extends ChartLabelConverter<IWalletPeriodStatistics> {
	convert(dayIndex: number): string {
		return capitalize(
			formatDate(new Date(2021, 10, dayIndex + 1), 'cccc', 'pl-PL')
		);
	}
}

export class StatisticsChartDataset extends ChartDataset<IWalletPeriodStatistics> {
	constructor(data: IWalletPeriodStatistics) {
		super(data, 'Wydatki');
	}

	length = this._calculateLength();

	getDataAt(index: number) {
		return String(index) in this.data ? (this.data as any)[index].expenses : 0;
	}

	private _calculateLength(): number {
		return (
			Math.max(
				...Object.keys(this.data)
					.map(k => Number(k))
					.filter(k => !isNaN(k))
			) + 1
		);
	}
}

export class StatisticsChartYearDataset extends StatisticsChartDataset {
	length = 12;
}

export class StatisticsChartMonthDataset extends StatisticsChartDataset {
	length = 6;
}

export class StatisticsChartWeekDataset extends StatisticsChartDataset {
	length = 7;
}
