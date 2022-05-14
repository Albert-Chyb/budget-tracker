import { formatDate } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Input,
	LOCALE_ID,
	Output,
} from '@angular/core';
import { capitalize } from '@common/helpers/capitalize';
import { beginningOfWeek } from '@common/helpers/date';
import { PeriodStatistics } from '@common/models/period-statistics';

const COMPACT_LAYOUT = Object.freeze({
	showAxisLabels: false,
	barPadding: 1,
	groupPadding: 2,
});

const FULL_LAYOUT = Object.freeze({
	showAxisLabels: true,
	barPadding: 8,
	groupPadding: 16,
});

export type TPeriodBarChartLayoutName = 'compact' | 'full';

@Component({
	selector: 'period-bar-chart',
	templateUrl: './period-bar-chart.component.html',
	styleUrls: ['./period-bar-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodBarChartComponent {
	constructor(@Inject(LOCALE_ID) private readonly _locale: string) {}

	private _statistics: PeriodStatistics;
	private _layoutName: TPeriodBarChartLayoutName = 'full';

	readonly colorScheme: any = {
		domain: ['var(--success-color)', 'var(--warn-color)'],
	};

	data: any;
	yAxisLabel = 'Suma pieniędzy';
	xAxisLabel: string = '';
	chartLayoutConfig: any = this._getLayoutConfig(this._layoutName);

	@Output() onPeriodSelect = new EventEmitter<PeriodStatistics>();

	@Input()
	set layout(newLayoutName: TPeriodBarChartLayoutName) {
		this._layoutName = newLayoutName;
		this.chartLayoutConfig = this._getLayoutConfig(newLayoutName);
	}
	get layout() {
		return this._layoutName;
	}

	@Input('period')
	set periodStatistics(value: PeriodStatistics) {
		this._statistics = value;
		this.data = Array.from(value).map(period =>
			this._convertPeriodToChartData(period)
		);
		this.xAxisLabel = this._getXAxisLabel();
	}
	get periodStatistics(): PeriodStatistics {
		return this._statistics;
	}

	handleBarSelect(event: any) {
		this.onPeriodSelect.emit(event.period);
	}

	private _getLayoutConfig(name: TPeriodBarChartLayoutName) {
		switch (name) {
			case 'compact':
				return COMPACT_LAYOUT;

			case 'full':
				return FULL_LAYOUT;
		}
	}

	private _convertPeriodToChartData(period: PeriodStatistics) {
		return {
			name: this._getPeriodLabel(period),
			series: [
				{
					name: 'Przychody',
					value: period.income,
					period,
				},
				{
					name: 'Wydatki',
					value: period.expenses,
					period,
				},
			],
		};
	}

	private _getPeriodLabel(statistics: PeriodStatistics): string {
		const [year, month, week, day] = statistics.period.parts;
		const periodName = statistics.period.name;
		let label: string;

		switch (periodName) {
			case 'month':
				label = formatDate(new Date(year, month, 1), 'LLLL', this._locale);
				break;

			case 'week':
				label = String(statistics.period.week + 1);
				break;

			case 'day':
				const weekBeginning = beginningOfWeek(year, month, week);
				const monday = weekBeginning.getDate();

				label = formatDate(
					new Date(year, month, monday + day),
					'EEEE',
					this._locale
				);
				break;

			default:
				break;
		}

		return capitalize(label);
	}

	private _getXAxisLabel() {
		const periodName = this._statistics.period.name;

		switch (periodName) {
			case 'year':
				return 'Miesiąc';

			case 'month':
				return 'Tydzień';

			case 'week':
				return 'Dzień tygodnia';

			default:
				return 'Okres';
		}
	}
}
