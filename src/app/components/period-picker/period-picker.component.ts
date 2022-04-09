import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { numberOfWeeksInMonth } from '@helpers/date';
import { Observable } from 'rxjs';

export type TPeriodName = 'year' | 'month' | 'week';

export type TPeriodPickerInjectorData = {
	years$: Observable<number[]>;
	value: TPeriodPickerValue;
};

export type TPeriodPickerValue = {
	year: number;
	month: number;
	week: number;
	periodName: TPeriodName;
} | null;

@Component({
	templateUrl: './period-picker.component.html',
	styleUrls: ['./period-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodPickerComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) private readonly _data: TPeriodPickerInjectorData
	) {}

	private _selectedPeriod: TPeriodName = this._data.value.periodName ?? 'year';
	year: number = this._data.value.year;
	month: number = this._data.value.month;
	week: number = this._data.value.week;

	years$ = this._data.years$;

	readonly months = [
		'Styczeń',
		'Luty',
		'Marzec',
		'Kwiecień',
		'Maj',
		'Czerwiec',
		'Lipiec',
		'Sierpień',
		'Wrzesień',
		'Październik',
		'Listopad',
		'Grudzień',
	];

	get selectedPeriod(): TPeriodName {
		return this._selectedPeriod;
	}
	set selectedPeriod(value: TPeriodName) {
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

	get weeks(): number[] {
		const length = numberOfWeeksInMonth(this.year, this.month);

		return new Array(length).fill(0).map((n, index) => index);
	}

	processValue(): TPeriodPickerValue {
		const value = {
			year: this.year,
			month: this.month,
			week: this.week,
			periodName: this.selectedPeriod,
		};
		return value;
	}
}
