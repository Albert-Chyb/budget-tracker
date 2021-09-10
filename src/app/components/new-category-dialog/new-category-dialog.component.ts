import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICategory, INewCategory } from 'src/app/common/interfaces/category';

@Component({
	templateUrl: './new-category-dialog.component.html',
	styleUrls: ['./new-category-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCategoryDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) private readonly _category: ICategory) {}

	private readonly rawCategory: INewCategory = {
		name: '',
		icon: null,
	};

	category = this.editMode ? { ...this._category } : this.rawCategory;

	get categoryIconPreview() {
		return typeof this.category.icon === 'string' ? this.category.icon : null;
	}

	get editMode() {
		return !!this._category;
	}
}
