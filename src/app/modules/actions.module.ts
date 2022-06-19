import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { APP_ACTION, APP_ACTIONS } from '../actions/action-provider-token';
import { DeleteWalletAction } from '../actions/delete-wallet';
import { RenameWalletAction } from '../actions/rename-wallet';
import { ActionDispatcherDirective } from '../directives/action-dispatcher/action-dispatcher.directive';

@NgModule({
	declarations: [ActionDispatcherDirective],
	imports: [CommonModule],
	exports: [ActionDispatcherDirective],
	providers: [
		{
			provide: APP_ACTION,
			useValue: ['delete-wallet', DeleteWalletAction],
			multi: true,
		},
		{
			provide: APP_ACTION,
			useValue: ['rename-wallet', RenameWalletAction],
			multi: true,
		},
		{
			provide: APP_ACTIONS,
			useFactory: (actions: [string, any][]) => new Map(actions),
			deps: [APP_ACTION],
		},
	],
})
export class ActionsModule {}
