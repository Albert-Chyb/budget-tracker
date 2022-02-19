import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
export class PaginatedTransactionsTableComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _categories: CategoriesService,
		private readonly _wallets: WalletsService,
		private readonly _afStore: AngularFirestore
	) {}

	@Input('transactionsPerPage') pageSize: number = 1;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	pageIndex: number = 0;
	readonly displayedColumns: string[] = [
		'category',
		'wallet',
		'date',
		'amount',
	];
	readonly transactionsDataSource =
		new PaginatedCollectionDataSource<ITransaction>(
			this._afStore,
			<any>this._transactions.collection$,
			'date',
			'desc'
		);

	readonly isLoading$ = this.transactionsDataSource.isLoading$;

	readonly data$ = combineLatest([
		this._categories.list(),
		this._wallets.list(),
	]).pipe(
		map(([categories, wallets]) => ({
			wallets,
			categories,
		}))
	);

	private _lastPageEvent: PageEvent = null;
	handlePageChange(pageEvent: PageEvent) {
		const { pageIndex, previousPageIndex, pageSize } = pageEvent;

		const pageSizeChanged: boolean =
			(this._lastPageEvent === null && pageSize !== this.pageSize) ||
			(this._lastPageEvent !== null &&
				this._lastPageEvent.pageSize !== pageSize);

		this._lastPageEvent = pageEvent;

		if (pageSizeChanged) {
			this.transactionsDataSource.firstPage(pageSize);
			this.paginator.pageIndex = 0;
		} else if (pageIndex > previousPageIndex) {
			this.transactionsDataSource.nextPage(pageSize);
		} else if (pageIndex < previousPageIndex) {
			this.transactionsDataSource.prevPage(pageSize);
		}
	}

	getCategoryName(categoryId: string, categories: ICategory[]): string {
		return categories.find(category => category.id === categoryId).name;
	}

	getWalletName(walletId: string, wallets: IWallet[]): string {
		return wallets.find(wallet => wallet.id === walletId).name;
	}

	ngOnInit(): void {
		this.transactionsDataSource.firstPage(this.pageSize);
	}
}
