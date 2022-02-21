import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { PaginatedCollectionDataSource } from 'src/app/common/models/paginated-collection-data-source';

@Component({
	selector: 'paginated-firestore-collection-table',
	templateUrl: './paginated-firestore-collection-table.component.html',
	styleUrls: ['./paginated-firestore-collection-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatedFirestoreCollectionTableComponent<T> implements OnInit {
	private _dataSource: PaginatedCollectionDataSource<T>;

	@Input('pageSize') pageSize: number = 10;
	@Input('length') length: number = 9;
	@Input('pageSizeOptions') pageSizeOptions: number[] = [5, 10, 25, 50, 100];

	@Input('dataSource')
	public set dataSource(value: PaginatedCollectionDataSource<T>) {
		this._dataSource = value;
		this.isLoading$ = value.isLoading$;
	}
	public get dataSource(): PaginatedCollectionDataSource<T> {
		return this._dataSource;
	}

	@ViewChild(MatPaginator) paginator: MatPaginator;

	isLoading$: Observable<boolean>;

	ngOnInit(): void {
		this.dataSource.firstPage(this.pageSize);
	}

	private _prevPageEvent: PageEvent = null;
	handlePageChange(pageEvent: PageEvent) {
		const { pageIndex, previousPageIndex, pageSize } = pageEvent;
		const prevPageSize = this._prevPageEvent?.pageSize ?? this.pageSize;
		const pageSizeChanged: boolean = prevPageSize !== pageSize;

		this._prevPageEvent = pageEvent;
		this.pageSize = pageSize;

		if (pageSizeChanged) {
			this.dataSource.firstPage(this.pageSize);
			this.paginator.pageIndex = 0;
		} else if (pageIndex > previousPageIndex) {
			this.dataSource.nextPage(this.pageSize);
		} else if (pageIndex < previousPageIndex) {
			this.dataSource.prevPage(this.pageSize);
		}
	}
}
