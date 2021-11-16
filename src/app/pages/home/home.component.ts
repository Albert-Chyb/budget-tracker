import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import {
	PeriodPickerComponent,
	TPeriodPickerValue,
} from 'src/app/components/period-picker/period-picker.component';
import {
	TWalletPickerValue,
	WalletPickerComponent,
} from 'src/app/components/wallet-picker/wallet-picker.component';

/*
 * The dialogs probably shouldn't call for data every time they are opened. Get data in this component and pass it to a dialog with injector.
 * Create responsive layout.
 *
 * Integrate this component with backend.
 */

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	constructor(private readonly _dialog: MatDialog) {}

	cols = 4;
	rowHeightRem = 15;
	gutterSizeRem = 0.5;

	private readonly _dataStream$ = new BehaviorSubject<TWalletPickerValue>(null);
	private readonly _periodStream$ = new BehaviorSubject<TPeriodPickerValue>(
		null
	);
	readonly data$ = this._dataStream$.asObservable();
	readonly period$ = this._periodStream$.asObservable();

	async changeDataSource() {
		const newDataSource = await this._openWalletPicker();

		if (newDataSource) {
			this._dataStream$.next(newDataSource);
		}

		console.log(newDataSource);
	}

	async changePeriod() {
		const newPeriod = await this._openPeriodPicker();

		if (newPeriod) {
			const [year, month, week, period] = newPeriod;

			this._periodStream$.next(newPeriod);

			console.log({ year, month, week, period });
		}
	}

	private _openWalletPicker() {
		return this._openPicker<
			WalletPickerComponent,
			TWalletPickerValue,
			TWalletPickerValue
		>(WalletPickerComponent, this._dataStream$.value);
	}

	private _openPeriodPicker() {
		return this._openPicker<
			PeriodPickerComponent,
			TPeriodPickerValue,
			TPeriodPickerValue
		>(
			PeriodPickerComponent,
			this._periodStream$.value ?? [null, null, null, null]
		);
	}

	private _openPicker<DialogComponent, InjectorData, CloseValue>(
		Component: ComponentType<DialogComponent>,
		data?: InjectorData
	) {
		return this._dialog
			.open<DialogComponent, InjectorData, CloseValue>(Component, {
				width: '30rem',
				data,
			})
			.afterClosed()
			.pipe(first())
			.toPromise();
	}
}
