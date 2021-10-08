import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, first, map, take } from 'rxjs/operators';
import { ICategory, ICategoryBase } from 'src/app/common/interfaces/category';
import {
	INewCategoryDialogResult,
	NewCategoryDialogComponent,
} from 'src/app/components/new-category-dialog/new-category-dialog.component';
import { DEFAULT_CLUE_NAME } from 'src/app/directives/clue-if/clue-if.directive';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { StorageService } from 'src/app/services/storage/storage.service';

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
		private readonly _storage: StorageService,
		private readonly _afStore: AngularFirestore
	) {}

	categories$: Observable<ICategory[]> = this._loading.add(
		this._categories.readAll()
	);

	/**
	 * Opens the dialog to gather required information and after closing, it adds a category with returned data.
	 */
	addCategory() {
		this._openDialog().subscribe(async result => {
			const id = this._afStore.createId();

			this._loading.add(
				this._categories.create(await this._buildCategory(result, id), id)
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
		category: INewCategoryDialogResult,
		id: string
	): Promise<ICategoryBase> {
		const iconChanged = category.icon instanceof File;
		let iconUrl: string;
		let iconPath: string;

		if (iconChanged) {
			const { URL, path } = await this._loading.add(
				this._uploadIcon(category.icon, id)
			);

			const [url, filePath] = await Promise.all([URL, path]);

			iconUrl = url;
			iconPath = filePath;
		}

		const payload: ICategoryBase = {
			name: category.name,
			icon: iconUrl,
			iconPath,
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
		icon: File,
		id: string
	): Promise<{ URL: Promise<string>; path: Promise<string> }> {
		const upload = await this._storage.upload('categories-icons', icon, id);
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
