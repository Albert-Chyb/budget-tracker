import { ValidatorFn } from '@angular/forms';

/**
 * Checks if control's value is lesser or equal than the given number.
 * It is meant to be used with text inputs.
 *
 * @param maxValue Max value
 * @returns Validator function
 */

export function maxValidator(maxValue: number): ValidatorFn {
	return control => {
		const number = Number(control.value);
		const max = maxValue ?? Infinity;

		if (isNullish(control.value) || isNaN(number) || control.invalid) {
			return null;
		}

		const isValid = number <= max;

		return isValid ? null : { max: { max } };
	};
}

function isNullish(value: any) {
	return value === null || value === undefined;
}
