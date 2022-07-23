import {
	formatCurrency,
	getLocaleCurrencySymbol,
	getLocaleNumberSymbol,
	NumberSymbol,
} from '@angular/common';
import {
	ChangeDetectorRef,
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

const MAX_ALLOWED_DECIMALS_PLACES = 2;
const NUMBER_INPUT_DECIMAL_SEPARATOR = '.';

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
		@Inject(DEFAULT_CURRENCY_CODE) private readonly _currencyCode: string,
		private readonly _changeDetector: ChangeDetectorRef
	) {
		this._inputRef = elementRef.nativeElement;
	}

	private _setNgFormValue: (newValue: number) => void;
	private _setNgTouchedState: () => void;
	private _inputRef: HTMLInputElement;

	@HostBinding('type') inputType: 'text' | 'number' = 'text';

	private readonly _decimalSeparator = getLocaleNumberSymbol(
		this._localeId,
		NumberSymbol.CurrencyDecimal
	);

	/** Matches all characters except decimal separator and digits. */
	private readonly _unwantedChars = new RegExp(
		'[^\\d' + this._decimalSeparator + ']',
		'g'
	);

	writeValue(amount: number): void {
		if (!isNullish(amount)) {
			this._inputRef.value = this._formatCurrency(amount);
		} else {
			this._inputRef.value = '';
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

	@HostListener('input')
	handleInput() {
		let [intPart, decimalPart] = this._inputRef.value.split(
			NUMBER_INPUT_DECIMAL_SEPARATOR
		);
		let wereDecimalsTrimmed = false;

		if (decimalPart?.length > MAX_ALLOWED_DECIMALS_PLACES) {
			decimalPart = decimalPart.substring(0, MAX_ALLOWED_DECIMALS_PLACES);
			wereDecimalsTrimmed = true;
		}

		const valueAsString = `${intPart}${NUMBER_INPUT_DECIMAL_SEPARATOR}${decimalPart}`;
		const valueAsNumber = parseFloat(valueAsString);

		this._setNgFormValue(isNaN(valueAsNumber) ? null : valueAsNumber);

		if (wereDecimalsTrimmed) {
			this._inputRef.value = valueAsString;
		}
	}

	@HostListener('focus')
	handleInputFocus() {
		const value: string = this._inputRef.value;

		this.inputType = 'number';
		this._inputRef.value = this._formatRawAmount(value);
		this._changeDetector.detectChanges();

		this._inputRef.select();
	}

	@HostListener('blur')
	handleInputBlur() {
		this.inputType = 'text';
		this._changeDetector.detectChanges();

		if (this._inputRef.value.length > 0) {
			this._inputRef.value = this._formatCurrency(
				parseFloat(
					this._inputRef.value.replace(
						this._decimalSeparator,
						NUMBER_INPUT_DECIMAL_SEPARATOR
					)
				)
			);
		}

		this._setNgTouchedState();
	}

	private _formatCurrency(value: number) {
		return formatCurrency(
			value,
			this._localeId,
			getLocaleCurrencySymbol(this._localeId),
			this._currencyCode
		);
	}

	private _formatRawAmount(value: string) {
		const sign = value.startsWith('-') ? '-' : '';

		return (
			sign +
			value
				.replace(this._unwantedChars, '')
				.replace(this._decimalSeparator, NUMBER_INPUT_DECIMAL_SEPARATOR)
		);
	}
}
