import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';

@Directive({
	selector: 'input[type="text"][max]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: MaxValidatorDirective,
			multi: true,
		},
	],
})
export class MaxValidatorDirective implements Validator {
	@Input('max') max: number = Infinity;

	validate(control: AbstractControl): ValidationErrors {
		const number = Number(control.value);
		const max = this.max ?? Infinity;

		if (this._isNullish(control.valid) || isNaN(number) || control.invalid) {
			return null;
		}

		const isValid = number <= max;

		return isValid ? null : { max: { max } };
	}

	private _isNullish(value: any) {
		return value === null || value === undefined;
	}
}
