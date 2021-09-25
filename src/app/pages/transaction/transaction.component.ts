import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
	constructor(private readonly _route: ActivatedRoute) {}

	isInEditState = !!this._route.snapshot.paramMap.get('id');

	formValue: ITransactionFormValue = {
		amount: undefined,
		date: new Date(),
		category: undefined,
		wallet: undefined,
		description: undefined,
	};

	create() {
		console.log('Creating a transaction');
	}

	update() {
		console.log('Updating the transaction');
	}

	delete() {
		console.log('Deleting the transaction');
	}
}
