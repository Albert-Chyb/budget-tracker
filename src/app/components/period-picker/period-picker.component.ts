import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimePeriod } from '@common/models/time-period';
import { numberOfWeeksInMonth } from '@helpers/date';
import { Observable } from 'rxjs';

export type TPeriodName = 'year' | 'month' | 'week';

export type TPeriodPickerInjectorData = {
	years$: Observable<number[]>;
	value: TPeriodPickerValue;
};

export type TPeriodPickerValue = TimePeriod;

@Component({
	templateUrl: './period-picker.component.html',
	styleUrls: ['./period-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodPickerComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) private readonly _data: TPeriodPickerInjectorData
	) {}

	readonly period = TimePeriod.fromPeriod(this._data.value);
	readonly years$ = this._data.years$;

	// TODO: Use formatDate() to generate list of months.
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

	get weeks(): number[] {
		const length = numberOfWeeksInMonth(this.period.year, this.period.month);

		return new Array(length).fill(0).map((n, index) => index);
	}

	processValue(): TPeriodPickerValue {
		return TimePeriod.fromPeriod(this.period);
	}
}
