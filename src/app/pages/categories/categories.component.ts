import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/common/interfaces/category';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
	constructor(
		private readonly _categories: CategoriesService,
		private readonly _loading: LoadingService
	) {}

	categories$: Observable<ICategory[]> = this._loading.add(
		this._categories.readAll()
	);

	trackById(index: number, category: ICategory) {
		return category.id;
	}
}
