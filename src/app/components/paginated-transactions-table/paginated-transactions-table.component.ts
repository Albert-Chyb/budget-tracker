import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import {
	DocumentChangeAction,
	QueryDocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ICategory } from 'src/app/common/interfaces/category';
import { ITransaction } from 'src/app/common/interfaces/transaction';
import { IWallet } from 'src/app/common/interfaces/wallet';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

interface IPageChangeEvent {
	direction: 'next' | 'prev' | 'first';
	pageSize: number;
}

class TransactionsDataSource implements DataSource<ITransaction> {
	constructor(private readonly _transactionsService: TransactionsService) {}

	/** First document in the latest batch. */
	private _firstSeen: QueryDocumentSnapshot<ITransaction>;

	/** Last document in the latest batch. */
	private _lastSeen: QueryDocumentSnapshot<ITransaction>;

	/** Emits whenever the page changes. */
	private readonly _onPageChange$ = new ReplaySubject<IPageChangeEvent>(1);

	/** Current batch of documents. */
	private readonly _latestBatch$ = this._onPageChange$.asObservable().pipe(
		switchMap(pageChange => this._getNewBatch(pageChange)),
		tap(docsSnapshots => this._setCursors(docsSnapshots)),
		map(snapshots => this._convertSnapshotsIntoDocs(snapshots))
	);

	connect(
		collectionViewer: CollectionViewer
	): Observable<readonly ITransaction[]> {
		return this._latestBatch$;
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this._onPageChange$.complete();
	}

	firstPage(pageSize: number) {
		this._onPageChange$.next({ direction: 'first', pageSize });
	}

	nextPage(pageSize: number) {
		return this._onPageChange$.next({ direction: 'next', pageSize });
	}

	prevPage(pageSize: number) {
		return this._onPageChange$.next({ direction: 'prev', pageSize });
	}

	private _setCursors(snapshots: DocumentChangeAction<ITransaction>[]) {
		if (snapshots.length === 0) {
			return;
		}

		this._firstSeen = snapshots[0].payload.doc;
		this._lastSeen = snapshots[snapshots.length - 1].payload.doc;
	}

	private _convertSnapshotsIntoDocs(
		snapshots: DocumentChangeAction<ITransaction>[]
	): ITransaction[] {
		return snapshots.map(snap => ({
			id: snap.payload.doc.id,
			...snap.payload.doc.data(),
		}));
	}

	/**
	 * Gets the new batch of documents, relatively to the cursors.
	 */
	private _getNewBatch(pageChange: IPageChangeEvent) {
		switch (pageChange.direction) {
			case 'first':
				return this._transactionsService.querySnap(queryBuilder =>
					queryBuilder.orderBy('date', 'desc').limit(pageChange.pageSize)
				);

			case 'next':
				return this._transactionsService.querySnap(queryBuilder =>
					queryBuilder
						.orderBy('date', 'desc')
						.startAfter(this._lastSeen)
						.limit(pageChange.pageSize)
				);

			case 'prev':
				return this._transactionsService.querySnap(queryBuilder =>
					queryBuilder
						.orderBy('date', 'desc')
						.endBefore(this._firstSeen)
						.limitToLast(pageChange.pageSize)
				);
		}
	}
}

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
		private readonly _wallets: WalletsService
	) {}

	@Input('transactionsPerPage') pageSize: number = 1;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	displayedColumns: string[] = ['category', 'wallet', 'date', 'amount'];
	pageIndex: number = 0;
	transactionsDataSource = new TransactionsDataSource(this._transactions);

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
		if (
			(this._lastPageEvent === null && pageEvent.pageSize !== this.pageSize) ||
			(this._lastPageEvent !== null &&
				this._lastPageEvent.pageSize !== pageEvent.pageSize)
		) {
			this.transactionsDataSource.firstPage(pageEvent.pageSize);
			this.paginator.firstPage();

			this._lastPageEvent = pageEvent;
			return;
		}

		const { pageIndex, previousPageIndex, pageSize } = pageEvent;

		if (pageIndex > previousPageIndex) {
			this.transactionsDataSource.nextPage(pageSize);
		} else if (pageIndex < previousPageIndex) {
			this.transactionsDataSource.prevPage(pageSize);
		}

		this._lastPageEvent = pageEvent;
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
