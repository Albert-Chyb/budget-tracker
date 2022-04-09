import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';
import { maxValidator } from '@validators/max-validator';

@Directive({
	selector: 'input[type="text"][textMax]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: MaxValidatorDirective,
			multi: true,
		},
	],
})
export class MaxValidatorDirective implements Validator {
	private _onChange: () => void;
	private _max: number = Infinity;

	@Input('textMax')
	set max(value: number) {
		this._max = value ?? Infinity;
		this._onChange?.();
	}
	get max() {
		return this._max;
	}

	validate(control: AbstractControl): ValidationErrors {
		return maxValidator(this.max)(control);
	}

	registerOnValidatorChange(fn: () => void) {
		this._onChange = fn;
	}
}
