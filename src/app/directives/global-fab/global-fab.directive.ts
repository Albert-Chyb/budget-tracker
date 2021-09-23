import { Directive, OnDestroy, OnInit, Self, TemplateRef } from '@angular/core';
import { FABService } from 'src/app/services/FAB/fab.service';

/**
 * Structural directive that displays the element that is attached to as a global floating action button.
 *
 * WARNING: The button is rendered in the global-fab component at the root level, not where it is declared.
 */

@Directive({
	selector: '[global-fab]',
})
export class GlobalFabDirective implements OnInit, OnDestroy {
	constructor(
		@Self() private readonly _templateRef: TemplateRef<any>,
		private readonly _FAB: FABService
	) {}

	ngOnInit() {
		this._FAB.insert(this._templateRef);
	}

	ngOnDestroy() {
		this._FAB.clear();
	}
}
