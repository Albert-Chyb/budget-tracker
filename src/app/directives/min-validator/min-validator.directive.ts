import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator
} from '@angular/forms';
import { minValidator } from 'src/app/common/validators/min-validator';

@Directive({
	selector: 'input[type="text"][textMin]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: MinValidatorDirective,
			multi: true,
		},
	],
})
export class MinValidatorDirective implements Validator {
	private _onChange: () => void;
	private _min: number = -Infinity;
	private _isInclusive: boolean;

	@Input('textMin')
	set min(value: number) {
		this._min = value ?? -Infinity;
		this._onChange?.();
	}
	get min() {
		return this._min;
	}

	@Input('isInclusive')
	public set isInclusive(value: boolean) {
		this._isInclusive = value;
		this._onChange?.();
	}
	public get isInclusive(): boolean {
		return this._isInclusive;
	}

	validate(control: AbstractControl): ValidationErrors {
		return minValidator(this.min, this.isInclusive)(control);
	}

	registerOnValidatorChange(fn: () => void) {
		this._onChange = fn;
	}
}
