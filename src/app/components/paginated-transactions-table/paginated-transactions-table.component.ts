import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEFAULT_CLUE_NAME } from '@directives/clue-if/clue-if.directive';
import { ICategory } from '@interfaces/category';
import { ITransaction } from '@interfaces/transaction';
import { IWallet } from '@interfaces/wallet';
import { PaginatedCollectionDataSource } from '@models/paginated-collection-data-source';
import { CategoriesService } from '@services/categories/categories.service';
import { CollectionsInfoService } from '@services/collections-info/collections-info.service';
import { TransactionsService } from '@services/transactions/transactions.service';
import { WalletsService } from '@services/wallets/wallets.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'paginated-transactions-table',
	templateUrl: './paginated-transactions-table.component.html',
	styleUrls: ['./paginated-transactions-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: DEFAULT_CLUE_NAME,
			useValue: 'noTransactions',
		},
	],
})
export class PaginatedTransactionsTableComponent {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _categories: CategoriesService,
		private readonly _wallets: WalletsService,
		private readonly _collectionsInfo: CollectionsInfoService
	) {}

	readonly dataSource: PaginatedCollectionDataSource<ITransaction> =
		new PaginatedCollectionDataSource<ITransaction>(
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
		this._collectionsInfo.read('transactions'),
	]).pipe(
		map(([categories, wallets, transactionsCollInfo]) => ({
			wallets,
			categories,
			transactionsCount: transactionsCollInfo?.docCount ?? 0,
		}))
	);

	getCategoryName(categoryId: string, categories: ICategory[]): string {
		return categories.find(category => category.id === categoryId).name;
	}

	getWalletName(walletId: string, wallets: IWallet[]): string {
		return wallets.find(wallet => wallet.id === walletId).name;
	}
}
