import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICategory } from '@interfaces/category';

@Component({
	selector: 'categories-list',
	templateUrl: './categories-list.component.html',
	styleUrls: ['./categories-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent {
	@Input('categories') categories: ICategory[];

	/** Function for ngFor directive. */
	trackById(index: number, category: ICategory) {
		return category.id;
	}
}
