import {
	getLocaleNumberSymbol,
	NumberSymbol,
	PercentPipe,
} from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

/** Works like the built-in percent pipe, but appends the plus sign for positive numbers. */
@Pipe({
	name: 'percentageChange',
})
export class PercentageChangePipe extends PercentPipe implements PipeTransform {
	constructor(@Inject(LOCALE_ID) private readonly _localeId: string) {
		super(_localeId);
	}

	transform(
		value: string | number,
		digitsInfo?: string,
		locale?: string
	): string;
	transform(value: null, digitsInfo?: string, locale?: string): null;
	transform(
		value: string | number,
		digitsInfo?: string,
		locale?: string
	): string;
	transform(value: any, digitsInfo?: any, locale?: any): string {
		const sign = this._getSign(Number(value));

		return sign + super.transform(value, digitsInfo, locale);
	}

	private _getSign(value: number): string {
		if (value > 0) {
			return getLocaleNumberSymbol(this._localeId, NumberSymbol.PlusSign);
		}

		return '';
	}
}
