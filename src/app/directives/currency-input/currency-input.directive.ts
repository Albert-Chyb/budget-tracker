import {
	formatCurrency,
	getLocaleNumberSymbol,
	NumberSymbol,
} from '@angular/common';
import {
	DEFAULT_CURRENCY_CODE,
	Directive,
	ElementRef,
	HostListener,
	Inject,
	LOCALE_ID,
	Renderer2,
	Self,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNullish } from 'src/app/common/helpers/isNullish';

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

	private _changeNgFormValue: (newValue: number) => void;
	private _setNgTouchedState: () => void;
	private _inputRef: HTMLInputElement;
	private _HTMLInputValue: string = '';

	private readonly _decimalSeparator = getLocaleNumberSymbol(
		this._localeId,
		NumberSymbol.CurrencyDecimal
	);

	/** Matches all characters except decimal separator and digits. */
	private readonly _unwantedChars = new RegExp(
		'[^\\d' + this._decimalSeparator + ']',
		'g'
	);
	private readonly _amountPattern = /(^[\d\s]*)((?<!\s)\,?\d{0,2})?$/;

	writeValue(amount: number): void {
		if (!isNullish(amount)) {
			this._setHTMLInputValue(this._formatCurrency(amount));
		} else {
			this._setHTMLInputValue('');
		}
	}

	registerOnChange(fn: any): void {
		this._changeNgFormValue = fn;
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

	@HostListener('focus')
	handleInputFocus() {
		this._inputRef.select();
	}

	@HostListener('input')
	handleInput() {
		const value = this._inputRef.value.trimLeft();
		const isValid = this._amountPattern.test(value);

		if (value.length === 0) {
			this._setHTMLInputValue(value);
			this._changeNgFormValue(null);
		} else if (!isValid) {
			this._setHTMLInputValue(this._HTMLInputValue);
		} else {
			const amount = +this._formatRawAmount(value);

			this._setHTMLInputValue(value);
			this._changeNgFormValue(amount);
		}
	}

	@HostListener('blur')
	handleInputBlur() {
		const value = this._inputRef.value.trim();
		const isValid = this._amountPattern.test(value);

		if (isValid && value.length > 0) {
			const amount = +this._formatRawAmount(value);

			this._setHTMLInputValue(this._formatCurrency(amount));
			this._changeNgFormValue(amount);
		} else {
			this._changeNgFormValue(null);
		}

		this._setNgTouchedState();
	}

	private _formatCurrency(value: number) {
		return formatCurrency(value, this._localeId, '', this._currencyCode);
	}

	private _setHTMLInputValue(newValue: string) {
		this._renderer.setProperty(this._inputRef, 'value', newValue);
		this._HTMLInputValue = newValue;
	}

	private _formatRawAmount(value: string) {
		return value
			.replace(this._unwantedChars, '')
			.replace(this._decimalSeparator, '.');
	}
}
