import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';
import {
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	Inject,
	LOCALE_ID,
	Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Money } from '@common/models/money';
import { isNullish } from '@helpers/isNullish';

const CURRENCY_PATTERN = /^\-?\d*(\,|\.)?\d{0,2}$/;

@Directive({
	selector: '[currencyInput]',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: CurrencyInputDirective,
			multi: true,
		},
	],
})
export class CurrencyInputDirective implements ControlValueAccessor {
	constructor(
		elementRef: ElementRef<HTMLInputElement>,
		private readonly _renderer: Renderer2,
		@Inject(LOCALE_ID) private readonly _localeId: string
	) {
		this._inputRef = elementRef.nativeElement;
	}

	private _setNgFormValue: (newValue: number) => void;
	private _setNgTouchedState: () => void;
	private _inputRef: HTMLInputElement;

	@HostBinding('type') readonly inputType = 'text';
	@HostBinding('inputmode') readonly inputmode = 'decimal';

	private readonly _decimalSeparator = getLocaleNumberSymbol(
		this._localeId,
		NumberSymbol.CurrencyDecimal
	);

	amount: Money;

	writeValue(amount: Money): void {
		if (!isNullish(amount)) {
			this._setInputValue(amount.toString());
		} else {
			this._setInputValue('');
		}
	}

	registerOnChange(fn: any): void {
		this._setNgFormValue = (newValue: number) => {
			const amount = isNullish(newValue)
				? null
				: Money.fromDecimal(newValue, this._localeId);

			this.amount = amount;
			fn(amount);
		};
	}

	registerOnTouched(fn: any): void {
		this._setNgTouchedState = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._inputRef.disabled = isDisabled;

		if (isDisabled) {
			this._renderer.setAttribute(this._inputRef, 'disabled', '');
		} else {
			this._renderer.removeAttribute(this._inputRef, 'disabled');
		}
	}

	@HostListener('input', ['$event']) handleInputChange($event: InputEvent) {
		const inputValue = this._getInputValue();
		const valueAsNumber = Number(inputValue);

		if (inputValue.length === 0) {
			// An empty string would coerce to a zero.
			this._setNgFormValue(null);
			return;
		}

		if (!CURRENCY_PATTERN.test(inputValue)) {
			// Check if the user entered a valid currency.
			this._setInputValue(String(this.amount?.asDecimal ?? ''));
			return;
		}

		if ($event.data === '.') {
			// Convert the dot to the decimal separator.
			this._setInputValue(inputValue);
		}

		if (inputValue === ',' || inputValue === '.') {
			// When the user intends to enter just the decimal part, he might start with the decimal separator.
			// This would result in an error so we automatically prepend 0 with decimal separator to the input,
			// and set the ng model's value to 0.

			this._setInputValue('0' + this._decimalSeparator);
			this._setNgFormValue(0);
			return;
		}

		if (inputValue === '-') {
			// The single minus sign would result in an error.
			// We skip updating the ng model until user enters an number.

			this._setNgFormValue(null);
			return;
		}

		this._setNgFormValue(valueAsNumber);
	}

	/** Formats input's value to a normal decimal number */
	@HostListener('focus') unformat() {
		if (!this.hasValue) {
			return;
		}

		this._setInputValue(String(this.amount.asDecimal));
		this._inputRef.select();
	}

	/** Formats input's value to a currency format */
	@HostListener('blur') format() {
		if (this.hasValue) {
			this._setInputValue(this.amount.toString());
		}

		this._setNgTouchedState();
	}

	/** Sets the value on the input without changing it in the ngModel. */
	private _setInputValue(value: string) {
		this._inputRef.value = value.replace('.', this._decimalSeparator);
	}

	private _getInputValue() {
		return this._inputRef.value.replace(this._decimalSeparator, '.');
	}

	get hasValue(): boolean {
		return !isNullish(this.amount);
	}
}
