import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { ICategory, INewCategory } from 'src/app/common/interfaces/category';
import { NewCategoryDialogComponent } from 'src/app/components/new-category-dialog/new-category-dialog.component';
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
		private readonly _loading: LoadingService,
		private readonly _dialog: MatDialog
	) {}

	categories$: Observable<ICategory[]> = this._loading.add(
		this._categories.readAll()
	);

	addCategory() {
		this._openDialog().subscribe(category => {
			// TODO: Remove this line and implement file upload service.
			category.icon = 'https://image.flaticon.com/icons/png/512/706/706164.png';

			this._loading.add(this._categories.create(category));
		});
	}

	editCategory(category: ICategory) {
		this._openDialog(category).subscribe(newCategory => {
			if (<any>newCategory.icon instanceof File) {
				// TODO: Remove this line and implement file upload service.
				newCategory.icon =
					'https://image.flaticon.com/icons/png/512/174/174872.png';
			}

			this._loading.add(this._categories.update(category.id, newCategory));
		});
	}

	deleteCategory(category: ICategory) {
		this._loading.add(this._categories.delete(category.id));
	}

	trackById(index: number, category: ICategory) {
		return category.id;
	}

	private _openDialog(data?: ICategory) {
		return this._dialog
			.open<NewCategoryDialogComponent, ICategory, INewCategory>(
				NewCategoryDialogComponent,
				{
					width: '300px',
					data,
				}
			)
			.afterClosed()
			.pipe(
				first(),
				filter(data => !!data)
			);
	}
}
