import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';
import { blackListValidator } from '@validators/black-list-validator';

@Directive({
	selector: '[black-list]',
	providers: [
		{
			provide: NG_VALIDATORS,
			multi: true,
			useExisting: BlackListValidatorDirective,
		},
	],
})
export class BlackListValidatorDirective implements Validator {
	private _onChange: () => void;
	private _blackList: any[] = [];

	@Input('black-list') set blackList(list: any[] | any) {
		if (Array.isArray(list)) {
			this._blackList = list;
		} else {
			this._blackList = [list];
		}

		this._onChange?.();
	}
	get blackList() {
		return this._blackList;
	}

	validate(control: AbstractControl): ValidationErrors {
		return blackListValidator(this.blackList)(control);
	}

	registerOnValidatorChange?(fn: () => void): void {
		this._onChange = fn;
	}
}
