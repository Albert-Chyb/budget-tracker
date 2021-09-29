import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function blackListValidator(values: any[]): ValidatorFn {
	return (control: AbstractControl): ValidationErrors => {
		const isValid = !values.includes(control.value);

		return isValid || control.invalid ? null : { hasBlackListedValue: {} };
	};
}
