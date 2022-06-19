import { Directive, HostListener, Input } from '@angular/core';
import { ActionDispatcherService } from '@services/action-dispatcher/action-dispatcher.service';

@Directive({
	selector: '[action]',
})
export class ActionDispatcherDirective<ActionPayload> {
	constructor(
		private readonly _actionDispatcher: ActionDispatcherService<any>
	) {}

	@Input('action-payload') payload: ActionPayload;
	@Input('action') actionName: string;

	@HostListener('click')
	dispatch(): void {
		this._actionDispatcher.dispatch(this.actionName, this.payload).subscribe();
	}
}
