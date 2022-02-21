import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
	providedIn: 'root',
})
export class PolishMatPaginatorIntl extends MatPaginatorIntl {
	itemsPerPageLabel: string = 'Liczba elementów na stronie';
	nextPageLabel: string = 'Następna strona';
	previousPageLabel: string = 'Poprzednia strona';
	firstPageLabel: string = 'Pierwsza strona';
	lastPageLabel: string = 'Ostatnia strona';

	getRangeLabel: (page: number, pageSize: number, length: number) => string = (
		page: number,
		pageSize: number,
		length: number
	) => {
		return `Strona ${page + 1} z ${Math.ceil(length / pageSize)}`;
	};
}
