import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { ICategory } from 'src/app/common/interfaces/category';

@Component({
	selector: 'categories-list',
	templateUrl: './categories-list.component.html',
	styleUrls: ['./categories-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent {
	@Input('categories') categories: ICategory[];

	@Output('onCategoryDelete') onCategoryDelete = new EventEmitter<ICategory>();
	@Output('onCategoryEdit') onCategoryEdit = new EventEmitter<ICategory>();

	/** Function for ngFor directive. */
	trackById(index: number, category: ICategory) {
		return category.id;
	}
}
