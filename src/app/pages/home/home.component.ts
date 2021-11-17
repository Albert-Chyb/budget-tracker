import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Breakpoint } from 'src/app/common/breakpoints';
import {
	PeriodPickerComponent,
	TPeriodPickerValue,
} from 'src/app/components/period-picker/period-picker.component';
import {
	TWalletPickerValue,
	WalletPickerComponent,
} from 'src/app/components/wallet-picker/wallet-picker.component';
import {
	largeLayout,
	mediumLayout,
	smallLayout,
	xSmallLayout,
} from './layouts';

/*
 * The dialogs probably shouldn't call for data every time they are opened. Get data in this component and pass it to a dialog with injector.
 * Create responsive layout when sidenav is opened.
 * Adjust charts theme to the dark background.
 *
 * Integrate this component with backend.
 */

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	constructor(
		private readonly _dialog: MatDialog,
		private readonly _breakpointObserver: BreakpointObserver
	) {}

	cols = 12;
	rowHeightRem = 1;
	gutterSizeRem = 0.5;

	private readonly _correspondingLayouts = new Map([
		['(max-width: 375px)', xSmallLayout],
		[Breakpoint.XSmall, smallLayout],
		[Breakpoint.Small, smallLayout],
		[Breakpoint.Medium, mediumLayout],
		[Breakpoint.Large, largeLayout],
		[Breakpoint.XLarge, largeLayout],
		[Breakpoint.XXLarge, largeLayout],
	]);

	readonly layout$ = this._breakpointObserver
		.observe(Array.from(this._correspondingLayouts.keys()))
		.pipe(
			map(state => {
				const [breakpoint] = Object.entries(state.breakpoints).find(
					([, isMatching]) => isMatching
				);

				return this._correspondingLayouts.get(breakpoint as Breakpoint);
			})
		);

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
