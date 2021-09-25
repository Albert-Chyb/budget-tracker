import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ITransactionFormValue {
	amount: string;
	date: Date;
	category: string;
	wallet: string;
	description: string;
}

@Component({
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent {
	formValue: ITransactionFormValue = {
		amount: undefined,
		date: new Date(),
		category: undefined,
		wallet: undefined,
		description: undefined,
	};
}
