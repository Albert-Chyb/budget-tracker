import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { numberOfWeeksInMonth } from 'src/app/common/helpers/date';

export type TPeriod = 'year' | 'month' | 'week';
export type TPeriodPickerInjectorData = {
	years$: Observable<number[]>;
	value: TPeriodPickerValue;
};
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
		@Inject(MAT_DIALOG_DATA) private readonly _data: TPeriodPickerInjectorData
	) {}

	private _selectedPeriod: TPeriod = this._data.value[3] ?? 'year';
	year: number = this._data.value[0];
	month: number = this._data.value[1];
	week: number = this._data.value[2];

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

	get weeks(): number[] {
		const length = numberOfWeeksInMonth(this.year, this.month);

		return new Array(length).fill(0).map((n, index) => index);
	}

	processValue(): TPeriodPickerValue {
		return [this.year, this.month, this.week, this.selectedPeriod];
	}
}
