import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	LOCALE_ID,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimePeriod } from '@common/models/time-period';
import { generateMonthsNames, numberOfWeeksInMonth } from '@helpers/date';
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
		@Inject(MAT_DIALOG_DATA) private readonly _data: TPeriodPickerInjectorData,
		@Inject(LOCALE_ID) private readonly _locale: string
	) {}

	readonly period = TimePeriod.fromPeriod(this._data.value);
	readonly years$ = this._data.years$;
	readonly months = generateMonthsNames(this._locale);

	get weeks(): number[] {
		const length = numberOfWeeksInMonth(this.period.year, this.period.month);

		return new Array(length).fill(0).map((n, index) => index);
	}

	processValue(): TPeriodPickerValue {
		return TimePeriod.fromPeriod(this.period);
	}
}
