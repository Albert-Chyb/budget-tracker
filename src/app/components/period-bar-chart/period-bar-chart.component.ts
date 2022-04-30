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

@Component({
	selector: 'period-bar-chart',
	templateUrl: './period-bar-chart.component.html',
	styleUrls: ['./period-bar-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodBarChartComponent {
	constructor(@Inject(LOCALE_ID) private readonly _locale: string) {}

	private _statistics: WalletStatistics;

	data: any;
	yAxisLabel = 'Suma pieniędzy';
	xAxisLabel: string = '';
	colorScheme: any = {
		domain: ['var(--success-color)', 'var(--warn-color)'],
	};

	@Output() onPeriodSelect = new EventEmitter<WalletStatistics>();

	@Input() showAxisLabels = true;
	@Input() barPadding = 8;
	@Input() groupPadding = 16;

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
