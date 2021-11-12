import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import {
	TWalletPickerValue,
	WalletPickerComponent,
} from 'src/app/components/wallet-picker/wallet-picker.component';

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
	constructor(private readonly _dialog: MatDialog) {}

	cols = 4;
	rowHeightRem = 15;
	gutterSizeRem = 0.5;

	readonly dataSource$ = new BehaviorSubject<TWalletPickerValue>(null);
	readonly period$ = new BehaviorSubject<any>(null);

	ngOnInit(): void {}

	async changeDataSource() {
		const newDataSource = await this._openWalletPicker();

		if (newDataSource) {
			this.dataSource$.next(newDataSource);
		}

		console.log(newDataSource);
	}

	private _openWalletPicker(): Promise<TWalletPickerValue> {
		return this._dialog
			.open(WalletPickerComponent, {
				data: this.dataSource$.value,
				width: '30rem',
			})
			.afterClosed()
			.pipe(first())
			.toPromise();
	}
}
