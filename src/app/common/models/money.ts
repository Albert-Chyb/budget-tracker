import {
	formatCurrency,
	getLocaleCurrencyCode,
	getLocaleCurrencySymbol,
} from '@angular/common';

export class Money {
	/**
	 * Represents money amount as an integer number (in subunits).
	 */
	private readonly _subunits: number;

	constructor(subunits: number | Money, private readonly _localeId: string) {
		if (subunits instanceof Money) {
			this._subunits = subunits._subunits;
			return;
		}

		if (!Number.isInteger(subunits)) {
			throw new Error('Money must be represented as an integer number.');
		}

		this._subunits = subunits;
	}

	add(otherAmount: Money): Money {
		return new Money(this.asInteger + otherAmount.asInteger, this._localeId);
	}

	subtract(otherAmount: Money): Money {
		return new Money(this.asInteger - otherAmount.asInteger, this._localeId);
	}

	multiply(multiplier: number): Money {
		return new Money(Math.ceil(this.asInteger * multiplier), this._localeId);
	}

	divide(divisor: number): Money {
		return new Money(Math.ceil(this.asInteger / divisor), this._localeId);
	}

	get asInteger(): number {
		return this._subunits;
	}

	get asDecimal(): number {
		return this._subunits / 100;
	}

	toString(): string {
		return formatCurrency(
			this.asDecimal,
			this._localeId,
			getLocaleCurrencySymbol(this._localeId),
			getLocaleCurrencyCode(this._localeId)
		);
	}

	[Symbol.toPrimitive](hint: string) {
		switch (hint) {
			case 'number':
				return this.asDecimal;

			case 'string':
				return this.toString();

			case 'default':
				return this;

			default:
				return this;
		}
	}

	static isMoney(value: any): boolean {
		return value instanceof Money;
	}

	static fromDecimal(amount: number, localeId: string): Money {
		return new Money(Math.trunc(Math.round(amount * 100)), localeId);
	}
}
