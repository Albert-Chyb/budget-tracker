import { TemplatePortal } from '@angular/cdk/portal';
import {
	ChangeDetectionStrategy,
	Component,
	ViewContainerRef,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { FABService } from 'src/app/services/FAB/fab.service';

/**
 * This component uses FABService to display currently set FAB button.
 */

@Component({
	selector: 'global-fab',
	templateUrl: './global-fab.component.html',
	styleUrls: ['./global-fab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalFabComponent {
	constructor(
		private readonly _FAB: FABService,
		private readonly _viewContainer: ViewContainerRef
	) {}

	onFABChange$ = this._FAB.onChange$.pipe(
		map(template =>
			template ? new TemplatePortal(template, this._viewContainer) : null
		)
	);
}
