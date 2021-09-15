import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, first, map, take } from 'rxjs/operators';
import { ICategory, INewCategory } from 'src/app/common/interfaces/category';
import {
	INewCategoryDialogResult,
	NewCategoryDialogComponent,
} from 'src/app/components/new-category-dialog/new-category-dialog.component';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
	constructor(
		private readonly _categories: CategoriesService,
		private readonly _loading: LoadingService,
		private readonly _dialog: MatDialog,
		private readonly _storage: StorageService
	) {}

	categories$: Observable<ICategory[]> = this._loading.add(
		this._categories.readAll()
	);

	/**
	 * Opens the dialog to gather required information and after closing, it adds a category with returned data.
	 */
	addCategory() {
		this._openDialog().subscribe(async result => {
			this._loading.add(
				this._categories.create(await this._buildCategory(result))
			);
		});
	}

	/**
	 * Opens the dialog to gather required information and after closing, it updates the category with returned data.
	 * @param category Category that will be updated.
	 */
	editCategory(category: ICategory) {
		this._openDialog(category).subscribe(async result => {
			const newCategory = await this._buildCategory(result);

			this._loading.add(this._categories.update(category.id, newCategory));
		});
	}

	/** Deletes a category. */
	deleteCategory(category: ICategory) {
		this._loading.add(this._categories.delete(category.id));
	}

	/** Function for ngFor directive. */
	trackById(index: number, category: ICategory) {
		return category.id;
	}

	/**
	 * Builds a category object with data returned from the dialog. If icon is available it is uploaded to the storage.
	 */
	private async _buildCategory(
		category: INewCategoryDialogResult
	): Promise<INewCategory> {
		let iconUrl: string;
		let iconPath: string;

		if (category.icon instanceof File) {
			const upload = await this._loading.add(this._uploadIcon(category.icon));
			iconUrl = await upload.URL;
			iconPath = await upload.path;
		}

		const payload: INewCategory = {
			name: category.name,
			icon: iconUrl,
			iconPath,
		};

		if (!iconUrl) {
			// Firestore cannot add an object that contains a property with null value.
			// It may happen when user updated category data but left icon the same.
			// Therefore the icon property is removed entirely.
			delete payload.icon;
		}

		return payload;
	}

	/**
	 * Opens a dialog.
	 *
	 * @param category Category object that will be available in the injector.
	 * @returns An observable that emits only once and only if dialog returns any data.
	 */
	private _openDialog(category?: ICategory) {
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

	/**
	 * Uploads an icon.
	 *
	 * @param icon Icon that will be uploaded to the storage.
	 * @returns Url to the file.
	 */
	private async _uploadIcon(
		icon: File
	): Promise<{ URL: Promise<string>; path: Promise<string> }> {
		const upload = await this._storage.upload('categories-icons', icon);
		const URL = upload.getURL$.toPromise();
		const path = upload.snapshot$
			.pipe(
				filter(snap => snap.bytesTransferred === snap.totalBytes),
				map(snap => snap.ref.fullPath),
				take(1)
			)
			.toPromise();

		return {
			URL,
			path,
		};
	}
}
