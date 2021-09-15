import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICategory } from 'src/app/common/interfaces/category';

export interface INewCategoryDialogResult {
	/** Name of the category */
	name: string;
	/** Icon of the category. It contains null value if none were selected. */
	icon: File | null;
}

@Component({
	templateUrl: './new-category-dialog.component.html',
	styleUrls: ['./new-category-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCategoryDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) private readonly _category: ICategory) {}

	private readonly _iconPreview: string = this.editMode
		? this._category.icon
		: null;

	result: INewCategoryDialogResult = this._buildFormValue();

	processForm() {
		return {
			name: this.result.name,
			icon: this.result.icon instanceof File ? this.result.icon : null,
		};
	}

	private _buildFormValue(): INewCategoryDialogResult {
		const name = this._category ? this._category.name : '';

		return {
			name,
			icon: null,
		};
	}

	get categoryIconPreview() {
		return this._iconPreview;
	}

	get editMode() {
		return !!this._category;
	}
}
