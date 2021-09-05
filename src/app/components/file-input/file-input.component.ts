import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type URL = string;
type FileInputValue = File | URL;

@Component({
	selector: 'file-input',
	templateUrl: './file-input.component.html',
	styleUrls: ['./file-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: FileInputComponent,
			multi: true,
		},
	],
})
export class FileInputComponent implements ControlValueAccessor {
	constructor() {}

	private _changeValue: (newValue: FileInputValue) => void;
	private _setTouchedState: () => void;

	writeValue(obj: FileInputValue): void {
		/*
      When file input receives an URL, download file first, and then transform it to the File object.
    */
		console.log(obj);
	}

	registerOnChange(fn: any): void {
		this._changeValue = fn;
	}

	registerOnTouched(fn: any): void {
		this._setTouchedState = fn;
	}

	setDisabledState?(isDisabled: boolean): void {}
}
