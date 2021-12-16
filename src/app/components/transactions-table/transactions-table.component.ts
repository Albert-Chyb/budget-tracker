import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITransaction } from 'src/app/common/interfaces/transaction';

@Component({
	selector: 'transactions-table',
	templateUrl: './transactions-table.component.html',
	styleUrls: ['./transactions-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent {
	/** Array of transactions */
	@Input('transactions') transactions: ITransaction[];

	/** Max number of transactions to display */
	@Input('maxCount') maxTransactionsCount = Infinity;

	readonly displayedColumns: (keyof ITransaction)[] = [
		'category',
		'wallet',
		'date',
		'amount',
	];

	limitTransactions(startFrom = 0) {
		return this.transactions.slice(startFrom, this.maxTransactionsCount);
	}
}
