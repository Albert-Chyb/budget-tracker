import { Directive, HostBinding } from '@angular/core';

@Directive({
	selector: '[page-toolbar]',
})
export class PageToolbarDirective {
	@HostBinding('style.background-color')
	bgColor = 'transparent';
}

@Directive({
	selector: '[page-toolbar-spacer]',
})
export class PageToolbarSpacerDirective {
	@HostBinding('style.flex-grow')
	flexGrow = '1';

	@HostBinding('style.flex-shrink')
	flexShrink = '1';

	@HostBinding('style.flex-basis')
	flexBasis = '100%';
}
