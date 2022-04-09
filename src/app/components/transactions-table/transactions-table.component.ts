import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICategory } from '@interfaces/category';
import { ITransaction } from '@interfaces/transaction';
import { IWallet } from '@interfaces/wallet';

@Component({
	selector: 'transactions-table',
	templateUrl: './transactions-table.component.html',
	styleUrls: ['./transactions-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent {
	@Input('transactions') transactions:
		| DataSource<ITransaction>
		| ITransaction[];
	@Input('categories') categories: ICategory[] = [];
	@Input('wallets') wallets: IWallet[] = [];

	readonly displayedColumns: string[] = [
		'category',
		'wallet',
		'date',
		'amount',
	];

	findWalletName(id: string): string {
		return this._findName(id, this.wallets);
	}

	findCategoryName(id: string): string {
		return this._findName(id, this.categories);
	}

	private _findName(id: string, array: { name: string; id: string }[]): string {
		const name = array.find(item => item.id === id)?.name;

		if (!name) {
			throw new Error(
				'Name could not be found. Did you forget to pass categories or wallets by inputs ?'
			);
		}

		return name;
	}
}
