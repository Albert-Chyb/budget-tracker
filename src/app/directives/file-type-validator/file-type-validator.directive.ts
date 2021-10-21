import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';
import { fileTypeValidator } from 'src/app/common/validators/file-type-validator';

@Directive({
	selector: '[allowed-files]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: FileTypeValidatorDirective,
			multi: true,
		},
	],
})
export class FileTypeValidatorDirective implements Validator {
	private _allowed: string[];
	private _onInputChange: () => void;

	@Input('allowed-files')
	set allowed(value: string[]) {
		this._allowed = value;
		this._onInputChange?.();
	}
	get allowed() {
		return this._allowed;
	}

	validate(control: AbstractControl): ValidationErrors {
		return fileTypeValidator(this.allowed)(control);
	}

	registerOnValidatorChange(fn: () => void): void {
		this._onInputChange = fn;
	}
}
