import { AbstractControl, ValidatorFn } from '@angular/forms';
import { isNullish } from '@common/helpers/isNullish';
import { Money } from '@common/models/money';

export function maxMoneyAmount(
	maxAmount: Money,
	isInclusive = false
): ValidatorFn {
	return (control: AbstractControl<Money>) => {
		if (isNullish(control.value)) {
			return null;
		}

		const isValid = isInclusive
			? control.value.asInteger <= maxAmount.asInteger
			: control.value.asInteger < maxAmount.asInteger;

		return isValid ? null : { tooMuchMoney: { maxPossibleAmount: maxAmount } };
	};
}
