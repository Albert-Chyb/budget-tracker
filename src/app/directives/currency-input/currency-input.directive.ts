import {
	formatCurrency,
	getLocaleCurrencySymbol,
	getLocaleNumberSymbol,
	NumberSymbol,
} from '@angular/common';
import {
	DEFAULT_CURRENCY_CODE,
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	Inject,
	LOCALE_ID,
	Renderer2,
	Self,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
		@Self() elementRef: ElementRef<HTMLInputElement>,
		private readonly _renderer: Renderer2,
		@Inject(LOCALE_ID) private readonly _localeId: string,
		@Inject(DEFAULT_CURRENCY_CODE) private readonly _currencyCode: string
	) {
		this._inputRef = elementRef.nativeElement;
	}

	private _setNgFormValue: (newValue: number) => void;
	private _setNgTouchedState: () => void;
	private _inputRef: HTMLInputElement;
	private _prevInputValue = '';

	@HostBinding('type') readonly inputType = 'text';
	@HostBinding('inputmode') readonly inputmode = 'decimal';

	private readonly _validCharacters = /\d|\,|\.|\-/;
	private readonly _decimalSeparator = getLocaleNumberSymbol(
		this._localeId,
		NumberSymbol.CurrencyDecimal
	);

	writeValue(amount: number): void {
		if (!isNullish(amount)) {
			this._setInputValue(this._formatCurrency(amount));
		} else {
			this._setInputValue('');
		}
	}

	registerOnChange(fn: any): void {
		this._setNgFormValue = fn;
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
			this._setInputValue(this._prevInputValue);
			return;
		}

		if ($event.data === '.') {
			// Convert the dot to the decimal separator.
			this._setInputValue(inputValue);
		}

		this._prevInputValue = inputValue;
		this._setNgFormValue(valueAsNumber);
	}

	/** Formats input's value to a normal decimal number */
	@HostListener('focus') unformat() {
		/** Input's value formatted as a currency */
		const formatted = this._getInputValue();
		const unformatted = [...formatted]
			.filter(letter => letter.match(this._validCharacters))
			.join('');

		this._prevInputValue = unformatted;
		this._setInputValue(unformatted);
		this._inputRef.select();
	}

	/** Formats input's value to a currency format */
	@HostListener('blur') format() {
		const inputValue = this._getInputValue();

		if (inputValue.length > 0) {
			this._setInputValue(this._formatCurrency(Number(inputValue)));
		}

		this._setNgTouchedState();
	}

	private _formatCurrency(currency: number) {
		const currencySymbol = getLocaleCurrencySymbol(this._localeId);

		return formatCurrency(
			currency,
			this._localeId,
			currencySymbol,
			this._currencyCode
		);
	}

	/** Sets the value on the input without changing it in the ngModel. */
	private _setInputValue(value: string) {
		this._inputRef.value = value.replace('.', this._decimalSeparator);
	}

	private _getInputValue() {
		return this._inputRef.value.replace(this._decimalSeparator, '.');
	}
}
