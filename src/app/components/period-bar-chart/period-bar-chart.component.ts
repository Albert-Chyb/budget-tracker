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
import {
	WalletDayStatistics,
	WalletMonthStatistics,
	WalletStatistics,
	WalletWeekStatistics,
	WalletYearStatistics,
} from '@common/models/wallet-statistics';

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

	private _statistics: WalletStatistics;
	private _layoutName: TPeriodBarChartLayoutName = 'full';

	readonly colorScheme: any = {
		domain: ['var(--success-color)', 'var(--warn-color)'],
	};

	data: any;
	yAxisLabel = 'Suma pieniędzy';
	xAxisLabel: string = '';
	chartLayoutConfig: any = this._getLayoutConfig(this._layoutName);

	@Output() onPeriodSelect = new EventEmitter<WalletStatistics>();

	@Input()
	set layout(newLayoutName: TPeriodBarChartLayoutName) {
		this._layoutName = newLayoutName;
		this.chartLayoutConfig = this._getLayoutConfig(newLayoutName);
	}
	get layout() {
		return this._layoutName;
	}

	@Input('period')
	set periodStatistics(value: WalletStatistics) {
		this._statistics = value;
		this.data = Array.from(value).map(period =>
			this._convertPeriodToChartData(period)
		);
		this.xAxisLabel = this._getXAxisLabel();
	}
	get periodStatistics(): WalletStatistics {
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

	private _convertPeriodToChartData(period: WalletStatistics) {
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

	private _getPeriodLabel(period: WalletStatistics): string {
		const [year, month, week, day] = period.date;
		let label: string;

		if (period instanceof WalletMonthStatistics) {
			label = formatDate(new Date(year, month, 1), 'LLLL', this._locale);
		} else if (period instanceof WalletWeekStatistics) {
			label = String(period.index + 1);
		} else if (period instanceof WalletDayStatistics) {
			const weekBeginning = beginningOfWeek(year, month, week);
			const monday = weekBeginning.getDate();

			label = formatDate(
				new Date(year, month, monday + day),
				'EEEE',
				this._locale
			);
		}

		return capitalize(label);
	}

	private _getXAxisLabel() {
		if (this._statistics instanceof WalletYearStatistics) {
			return 'Miesiąc';
		} else if (this._statistics instanceof WalletMonthStatistics) {
			return 'Tydzień';
		} else if (this._statistics instanceof WalletWeekStatistics) {
			return 'Dzień tygodnia';
		} else {
			return 'Okres';
		}
	}
}
