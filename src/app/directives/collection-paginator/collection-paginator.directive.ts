import { Directive, HostListener, Input, OnInit, Self } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaginatedCollectionDataSource } from '@models/paginated-collection-data-source';

@Directive({
	selector: 'mat-paginator[collection-paginator]',
})
export class CollectionPaginatorDirective<T> implements OnInit {
	constructor(@Self() private readonly _paginator: MatPaginator) {}

	private _prevPageSize: number;

	@Input('dataSource') dataSource: PaginatedCollectionDataSource<T>;

	@HostListener('page', ['$event'])
	handlePageChange(pageEvent: PageEvent) {
		const { pageIndex, previousPageIndex, pageSize } = pageEvent;
		const pageSizeChanged: boolean = this._prevPageSize !== pageSize;

		this._prevPageSize = pageEvent.pageSize;

		if (pageSizeChanged) {
			this.dataSource.firstPage(pageSize);
			this._paginator.pageIndex = 0;
		} else if (pageIndex > previousPageIndex) {
			this.dataSource.nextPage(pageSize);
		} else if (pageIndex < previousPageIndex) {
			this.dataSource.prevPage(pageSize);
		}
	}

	ngOnInit(): void {
		this._prevPageSize = this._paginator.pageSize;
		this.dataSource.firstPage(this._paginator.pageSize);
	}
}
