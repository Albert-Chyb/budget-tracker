import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICategory } from '@interfaces/category';

@Component({
	selector: 'category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
	@Input('category') category: ICategory;
}
