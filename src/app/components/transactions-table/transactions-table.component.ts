import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICategory } from 'src/app/common/interfaces/category';
import { ITransaction } from 'src/app/common/interfaces/transaction';
import { IWallet } from 'src/app/common/interfaces/wallet';

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

	@Input('categories') categories: ICategory[] = [];
	@Input('wallets') wallets: IWallet[] = [];

	readonly displayedColumns: (keyof ITransaction)[] = [
		'category',
		'wallet',
		'date',
		'amount',
	];

	limitTransactions(startFrom = 0) {
		return this.transactions.slice(startFrom, this.maxTransactionsCount);
	}

	findWalletName(id: string): string {
		return this._findName(id, this.wallets);
	}

	findCategoryName(id: string): string {
		return this._findName(id, this.categories);
	}

	private _findName(id: string, array: { name: string; id: string }[]): string {
		return array.find(item => item.id === id).name;
	}
}
