import {
	formatCurrency,
	getLocaleNumberSymbol,
	NumberSymbol,
} from '@angular/common';
import {
	DEFAULT_CURRENCY_CODE,
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Inject,
	LOCALE_ID,
	Output,
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
		elementRef: ElementRef<HTMLInputElement>,
		@Inject(LOCALE_ID) private readonly _localeId: string,
		@Inject(DEFAULT_CURRENCY_CODE) private readonly _currencyCode: string
	) {
		this._inputRef = elementRef.nativeElement;
	}

	private _changeNgFormValue: (newValue: number) => void;
	private _setNgTouchedState: () => void;
	private _inputRef: HTMLInputElement;

	private readonly _decimalSeparator = getLocaleNumberSymbol(
		this._localeId,
		NumberSymbol.CurrencyDecimal
	);

	/** Matches all characters except decimal separator and digits. */
	private readonly _unwantedChars = new RegExp(
		'[^\\d' + this._decimalSeparator + ']',
		'g'
	);

	@Output('onInvalidInput')
	onInvalidInput = new EventEmitter<void>();

	writeValue(value: any): void {
		this.setAmount(value);
	}

	registerOnChange(fn: any): void {
		this._changeNgFormValue = fn;
	}

	registerOnTouched(fn: any): void {
		this._setNgTouchedState = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._inputRef.disabled = isDisabled;
	}

	@HostListener('focus')
	handleInputFocus() {
		this._inputRef.select();
	}

	@HostListener('blur')
	handleInputBlur() {
		const value = this._inputRef.value.trim();
		const isValid = /^([\d\s]*)([\d],?\d{0,2})$/.test(value);

		if (!isValid) {
			this.setAmount(null);
			this.onInvalidInput.emit();
		} else {
			const amount = value
				.replace(this._unwantedChars, '')
				.replace(this._decimalSeparator, '.');

			this.setAmount(+amount);
		}

		this._setNgTouchedState();
	}

	setAmount(amount: number) {
		if (isNullish(amount)) {
			this._setHTMLInputValue('');
			this._changeNgFormValue?.(null);
		} else if (typeof amount === 'number') {
			this._setHTMLInputValue(this._formatCurrency(amount));
			this._changeNgFormValue?.(amount);
		} else {
			throw new Error('The amount must be a number.');
		}
	}

	private _formatCurrency(value: number) {
		return formatCurrency(value, this._localeId, '', this._currencyCode);
	}

	private _setHTMLInputValue(newValue: string) {
		this._inputRef.value = newValue;
	}
}
