import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
	ValidatorFn,
} from '@angular/forms';

@Directive({
	selector: '[validator]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: FormControlValidatorDirective,
			multi: true,
		},
	],
})
export class FormControlValidatorDirective<
	TValue,
	TRawValue extends TValue = TValue
> implements Validator
{
	private _validator: ValidatorFn;
	private _onValidatorChange: () => void;

	@Input('validator')
	public set validator(value: ValidatorFn) {
		this._validator = value;
		this._onValidatorChange?.();
	}
	public get validator(): ValidatorFn {
		return this._validator;
	}

	validate(control: AbstractControl<TValue, TRawValue>): ValidationErrors {
		return this.validator(control);
	}

	registerOnValidatorChange(fn: () => void): void {
		this._onValidatorChange = fn;
	}
}
