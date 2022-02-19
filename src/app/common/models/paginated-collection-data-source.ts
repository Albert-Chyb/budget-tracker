import { DataSource } from '@angular/cdk/collections';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	DocumentChangeAction,
	QueryDocumentSnapshot,
	QueryFn,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
	debounceTime,
	distinctUntilChanged,
	finalize,
	map,
	switchMap,
	tap,
} from 'rxjs/operators';

export interface IPageChangeEvent {
	direction: 'next' | 'prev' | 'first';
	pageSize: number;
}

export class PaginatedCollectionDataSource<T> implements DataSource<T> {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _collection$: Observable<AngularFirestoreCollection<T>>,
		private readonly _field: firebase.firestore.FieldPath | string,
		private readonly _orderDirection: firebase.firestore.OrderByDirection
	) {}

	/** First document in the latest batch. */
	private _firstSeen: QueryDocumentSnapshot<T>;

	/** Last document in the latest batch. */
	private _lastSeen: QueryDocumentSnapshot<T>;

	/** Emits whenever the page changes. */
	private readonly _onPageChange$ = new ReplaySubject<IPageChangeEvent>(1);

	/** Current batch of documents. */
	private readonly _latestBatch$ = this._onPageChange$.asObservable().pipe(
		tap(() => this._isLoading$.next(true)),
		switchMap(pageChange => this._getNewBatch(pageChange)),
		tap(docsSnapshots => this._setCursors(docsSnapshots)),
		map(snapshots => this._convertSnapshotsIntoDocs(snapshots)),
		tap(() => this._isLoading$.next(false)),
		finalize(() => this._isLoading$.next(false))
	);

	/** Emits whenever new batch is being downloaded. */
	private readonly _isLoading$ = new BehaviorSubject<boolean>(true);

	/** Emits whenever new batch is being downloaded. */
	public readonly isLoading$ = this._isLoading$
		.asObservable()
		.pipe(distinctUntilChanged(), debounceTime(50));

	connect(): Observable<readonly T[]> {
		return this._latestBatch$;
	}

	disconnect(): void {
		this._onPageChange$.complete();
		this._isLoading$.complete();
	}

	/** Download documents on the first page. */
	firstPage(pageSize: number) {
		this._onPageChange$.next({ direction: 'first', pageSize });
	}

	/** Download documents on the next page. */
	nextPage(pageSize: number) {
		return this._onPageChange$.next({ direction: 'next', pageSize });
	}

	/** Download documents on the previous page. */
	prevPage(pageSize: number) {
		return this._onPageChange$.next({ direction: 'prev', pageSize });
	}

	private _setCursors(snapshots: DocumentChangeAction<T>[]) {
		if (snapshots.length === 0) {
			return;
		}

		this._firstSeen = snapshots[0].payload.doc;
		this._lastSeen = snapshots[snapshots.length - 1].payload.doc;
	}

	private _convertSnapshotsIntoDocs(snapshots: DocumentChangeAction<T>[]): T[] {
		return snapshots.map(snap => ({
			id: snap.payload.doc.id,
			...snap.payload.doc.data(),
		}));
	}

	/**
	 * Gets the new batch of documents, relatively to the cursors.
	 */
	private _getNewBatch(pageChange: IPageChangeEvent) {
		let queryFn: QueryFn;

		switch (pageChange.direction) {
			case 'first':
				queryFn = queryBuilder =>
					queryBuilder
						.orderBy(this._field, this._orderDirection)
						.limit(pageChange.pageSize);
				break;

			case 'next':
				queryFn = queryBuilder =>
					queryBuilder
						.orderBy(this._field, this._orderDirection)
						.startAfter(this._lastSeen)
						.limit(pageChange.pageSize);
				break;

			case 'prev':
				queryFn = queryBuilder =>
					queryBuilder
						.orderBy(this._field, this._orderDirection)
						.endBefore(this._firstSeen)
						.limitToLast(pageChange.pageSize);
				break;
		}

		return this._collection$.pipe(
			switchMap(collection =>
				this._afStore.collection<T>(collection.ref, queryFn).snapshotChanges()
			)
		);
	}
}
