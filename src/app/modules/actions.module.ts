import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { APP_ACTION, APP_ACTIONS } from '../actions/action-provider-token';
import { DeleteCategoryAction } from '../actions/delete-category';
import { DeleteWalletAction } from '../actions/delete-wallet';
import { RenameWalletAction } from '../actions/rename-wallet';
import { TransferMoneyAction } from '../actions/transfer-money';
import { UpdateCategoryAction } from '../actions/update-category';
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
			provide: APP_ACTION,
			useValue: ['delete-category', DeleteCategoryAction],
			multi: true,
		},
		{
			provide: APP_ACTION,
			useValue: ['update-category', UpdateCategoryAction],
			multi: true,
		},
		{
			provide: APP_ACTION,
			useValue: ['transfer-money', TransferMoneyAction],
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
