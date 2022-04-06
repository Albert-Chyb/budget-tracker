import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { ICategory } from 'src/app/common/interfaces/category';

@Component({
	selector: 'category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
	@Input('category') category: ICategory;

	@Output('onCategoryDelete') onCategoryDelete = new EventEmitter<ICategory>();

	@Output('onCategoryEdit') onCategoryEdit = new EventEmitter<ICategory>();
}
