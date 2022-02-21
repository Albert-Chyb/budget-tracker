import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/common/interfaces/category';
import { ITransaction } from 'src/app/common/interfaces/transaction';
import { IWallet } from 'src/app/common/interfaces/wallet';
import { PaginatedCollectionDataSource } from 'src/app/common/models/paginated-collection-data-source';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

@Component({
	selector: 'paginated-transactions-table',
	templateUrl: './paginated-transactions-table.component.html',
	styleUrls: ['./paginated-transactions-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatedTransactionsTableComponent {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _categories: CategoriesService,
		private readonly _wallets: WalletsService,
		private readonly _afStore: AngularFirestore
	) {}

	readonly dataSource: PaginatedCollectionDataSource<ITransaction> =
		new PaginatedCollectionDataSource<ITransaction>(
			this._afStore,
			<any>this._transactions.collection$,
			'date',
			'desc'
		);

	readonly displayedColumns: string[] = [
		'category',
		'wallet',
		'date',
		'amount',
	];

	readonly data$ = combineLatest([
		this._categories.list(),
		this._wallets.list(),
	]).pipe(
		map(([categories, wallets]) => ({
			wallets,
			categories,
		}))
	);

	getCategoryName(categoryId: string, categories: ICategory[]): string {
		return categories.find(category => category.id === categoryId).name;
	}

	getWalletName(walletId: string, wallets: IWallet[]): string {
		return wallets.find(wallet => wallet.id === walletId).name;
	}
}
