import { Directive, ElementRef, HostListener } from '@angular/core';

/** Selects the value of an input when user focused it. */

@Directive({
	selector: '[select-on-focus]',
})
export class SelectOnFocusDirective {
	constructor(private readonly _elementRef: ElementRef<HTMLInputElement>) {}

	@HostListener('focus')
	selectValue() {
		this._elementRef.nativeElement.select();
	}
}
