import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';
import { fileSizeValidator } from 'src/app/common/validators/file-size-validator';

@Directive({
	selector: '[max-file-size]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: FileSizeValidatorDirective,
			multi: true,
		},
	],
})
export class FileSizeValidatorDirective implements Validator {
	private _onInputChange: () => void;
	private _maxSize: number;

	@Input('max-file-size')
	set maxSize(value: number) {
		this._maxSize = value;
		this._onInputChange?.();
	}
	get maxSize() {
		return this._maxSize;
	}

	validate(control: AbstractControl): ValidationErrors {
		return fileSizeValidator(this.maxSize)(control);
	}

	registerOnValidatorChange(fn: () => void): void {
		this._onInputChange = fn;
	}
}
