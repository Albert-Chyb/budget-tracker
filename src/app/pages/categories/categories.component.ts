import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
	INewCategoryDialogResult,
	NewCategoryDialogComponent,
} from '@components/new-category-dialog/new-category-dialog.component';
import { DEFAULT_CLUE_NAME } from '@directives/clue-if/clue-if.directive';
import { generateUniqueString } from '@helpers/generateUniqueString';
import { ICategory, ICategoryBase } from '@interfaces/category';
import { AlertService } from '@services/alert/alert.service';
import { CategoriesService } from '@services/categories/categories.service';
import { LoadingService } from '@services/loading/loading.service';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Component({
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: DEFAULT_CLUE_NAME,
			useValue: 'noCategories',
		},
	],
})
export class CategoriesComponent {
	constructor(
		private readonly _categories: CategoriesService,
		private readonly _loading: LoadingService,
		private readonly _dialog: MatDialog,
		private readonly _alert: AlertService
	) {}

	categories$: Observable<ICategory[]> = this._categories.list();

	/**
	 * Opens the dialog to gather required information and after closing, it adds a category with returned data.
	 */
	addCategory() {
		this._openDialog().subscribe(async result => {
			const id = generateUniqueString();

			this._loading.add(
				this._categories
					.create(await this._buildCategory(result, id), id)
					.pipe(first())
					.toPromise()
			);
		});
	}

	/**
	 * Opens the dialog to gather required information and after closing, it updates the category with returned data.
	 * @param category Category that will be updated.
	 */
	editCategory(category: ICategory) {
		this._openDialog(category).subscribe(async result => {
			const newCategory = await this._buildCategory(result, category.id);

			this._loading.add(
				this._categories
					.update(category.id, newCategory)
					.pipe(first())
					.toPromise()
			);
		});
	}

	/** Deletes a category. */
	async deleteCategory(category: ICategory) {
		try {
			await this._loading.add(
				this._categories.delete(category.id).pipe(first()).toPromise()
			);
		} catch (error) {
			this._handleError(error);
		}
	}

	/**
	 * Builds a category object with data returned from the dialog. If icon is available it is uploaded to the storage.
	 */
	private async _buildCategory(
		category: INewCategoryDialogResult,
		id: string
	): Promise<ICategoryBase> {
		const iconChanged = category.icon instanceof File;
		let iconUrl: string;
		let iconPath: string;

		if (iconChanged) {
			const { url, path } = await this._loading.add(
				this._categories.uploadIcon(category.icon, id).pipe(first()).toPromise()
			);

			iconUrl = url;
			iconPath = path;
		}

		const payload: ICategoryBase = {
			name: category.name,
			icon: iconUrl,
			iconPath,
			defaultTransactionsType: category.defaultTransactionsType,
		};

		if (!iconChanged) {
			delete payload.icon;
			delete payload.iconPath;
		}

		return payload;
	}

	/**
	 * Opens a dialog.
	 *
	 * @param category Category object that will be available in the injector.
	 * @returns An observable that emits only once and only if dialog returns any data.
	 */
	private _openDialog(
		category?: ICategory
	): Observable<INewCategoryDialogResult> {
		return this._dialog
			.open<
				NewCategoryDialogComponent,
				ICategory | null,
				INewCategoryDialogResult
			>(NewCategoryDialogComponent, {
				width: '300px',
				data: category,
			})
			.afterClosed()
			.pipe(
				first(),
				filter(data => !!data)
			);
	}

	private _handleError(error: any): void {
		if (error.code === 'is-referenced') {
			this._alert.open(
				'Przynajmniej jedna transakcja znajduję się w tej kategorii.',
				'Błąd podczas usuwania kategorii.'
			);
		}
	}
}
