import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICategory } from 'src/app/common/interfaces/category';
import { TTransactionType } from 'src/app/common/interfaces/transaction';

export interface INewCategoryDialogResult {
	/** Name of the category */
	name: string;
	/** Icon of the category. It contains null value if none were selected. */
	icon: File | null;
	defaultTransactionsType: TTransactionType;
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
			defaultTransactionsType: this.result.defaultTransactionsType,
		};
	}

	private _buildFormValue(): INewCategoryDialogResult {
		return {
			name: this._category?.name ?? '',
			icon: null,
			defaultTransactionsType:
				this._category?.defaultTransactionsType ?? 'expense',
		};
	}

	get categoryIconPreview() {
		return this._iconPreview;
	}

	get editMode() {
		return !!this._category;
	}
}
