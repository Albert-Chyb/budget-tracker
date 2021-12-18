import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export type TPeriod = 'year' | 'month' | 'week';
export type TPeriodPickerValue =
	| [number | null, number | null, number | null, TPeriod]
	| null;

@Component({
	templateUrl: './period-picker.component.html',
	styleUrls: ['./period-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodPickerComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) private readonly _initialValue: TPeriodPickerValue
	) {}

	private _selectedPeriod: TPeriod = this._initialValue[3] ?? 'year';
	year: number = this._initialValue[0];
	month: number = this._initialValue[1];
	week: number = this._initialValue[2];

	get selectedPeriod(): TPeriod {
		return this._selectedPeriod;
	}
	set selectedPeriod(value: TPeriod) {
		this._selectedPeriod = value;

		switch (value) {
			case 'year':
				this.month = null;
				this.week = null;
				break;

			case 'month':
				this.week = null;
				break;

			case 'week':
				break;

			default:
				throw new Error('There is not such period.');
		}
	}

	get hasSelection(): boolean {
		return !!this.selectedPeriod;
	}

	get isSelectedYear(): boolean {
		return this.selectedPeriod === 'year';
	}

	get isSelectedMonth(): boolean {
		return this.selectedPeriod === 'month';
	}

	get isSelectedWeek(): boolean {
		return this.selectedPeriod === 'week';
	}

	processValue(): TPeriodPickerValue {
		return [this.year, this.month, this.week, this.selectedPeriod];
	}
}
