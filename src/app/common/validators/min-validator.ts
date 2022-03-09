import { ValidatorFn } from '@angular/forms';
import { isNullish } from '../helpers/isNullish';

/**
 * Checks if control's value is lesser or equal than the given number.
 * It is meant to be used with text inputs.
 *
 * @param minValue Max value
 * @returns Validator function
 */

export function minValidator(
	minValue: number,
	isInclusive: boolean = true
): ValidatorFn {
	return control => {
		const number = Number(control.value);
		const min = minValue ?? Infinity;

		if (isNullish(control.value) || isNaN(number) || control.invalid) {
			return null;
		}

		const isValid = isInclusive ? number >= min : number > min;

		return isValid ? null : { min: { min } };
	};
}
