import { Directive } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';

/**
 * Regular expression that ensures right money format in an input.
 *
 * It follows these rules:
 * * must start with a digit
 * * next characters must be digits
 * * max 2 decimal places allowed
 * * decimal part of the number is optional
 */
const AMOUNT_REG_EXP = new RegExp(/^\d\d*((\.|\,)\d{1,2})?$/);

@Directive({
	selector: '[money-amount-validator]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: MoneyAmountValidatorDirective,
			multi: true,
		},
	],
})
export class MoneyAmountValidatorDirective implements Validator {
	validate(control: AbstractControl): ValidationErrors {
		if (!control.value) return null;

		const isInvalid = !AMOUNT_REG_EXP.test(String(control.value));

		const error = {
			invalidMoneyFormat: true,
		};

		return isInvalid ? error : null;
	}
}
