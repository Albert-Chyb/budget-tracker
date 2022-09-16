import { AbstractControl, ValidatorFn } from '@angular/forms';
import { isNullish } from '@common/helpers/isNullish';
import { Money } from '@common/models/money';

export function minMoneyAmount(
	minAmount: Money,
	isInclusive = false
): ValidatorFn {
	return (control: AbstractControl<Money>) => {
		if (isNullish(control.value)) {
			return null;
		}

		const isValid = isInclusive
			? control.value.asInteger >= minAmount.asInteger
			: control.value.asInteger > minAmount.asInteger;

		return isValid
			? null
			: { tooLittleMoney: { minPossibleAmount: minAmount } };
	};
}
