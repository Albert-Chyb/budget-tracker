import { MatDialog } from '@angular/material/dialog';
import { isNullish } from '@common/helpers/isNullish';
import { ICategory, ICategoryUpdatePayload } from '@common/interfaces/category';
import {
	INewCategoryDialogResult,
	NewCategoryDialogComponent,
} from '@components/new-category-dialog/new-category-dialog.component';
import { CategoriesService } from '@services/categories/categories.service';
import { LoadingService } from '@services/loading/loading.service';
import { defer, from, iif, Observable, of } from 'rxjs';
import { filter, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ActionDefinition } from './action-definition';

export class UpdateCategoryAction extends ActionDefinition<ICategory> {
	private readonly _dialog = this.getDependency(MatDialog);
	private readonly _categories = this.getDependency(CategoriesService);
	private readonly _loading = this.getDependency(LoadingService);
	private _icon: File;

	onCompleteMsg: string = `Pomyślnie zaktualizowano kategorię: ${this.payload.name}`;

	execute(): Observable<void> {
		const execTask = this._openDialog().pipe(
			switchMap(dialogData =>
				iif(
					() => dialogData.icon instanceof File,
					defer(() =>
						this._saveIcon().pipe(
							switchMap(() => this._uploadIcon(dialogData.icon))
						)
					),
					of({ url: this.payload.icon, path: this.payload.iconPath })
				).pipe(
					map(icon => {
						const category: ICategoryUpdatePayload = {
							name: dialogData.name,
							defaultTransactionsType: dialogData.defaultTransactionsType,
							icon: icon.url,
							iconPath: icon.path,
						};

						return category;
					})
				)
			),
			switchMap(newCategory =>
				this._categories.update(this.payload.id, newCategory)
			)
		);

		return this._loading.add(execTask);
	}

	undo(): Observable<void> {
		const undoTask = iif(
			() => isNullish(this._icon),
			of({ url: this.payload.icon, path: this.payload.iconPath }),
			defer(() => this._categories.uploadIcon(this._icon, this.payload.id))
		).pipe(
			switchMap(icon => {
				const category: ICategoryUpdatePayload = {
					name: this.payload.name,
					defaultTransactionsType: this.payload.defaultTransactionsType,
					icon: icon.url,
					iconPath: icon.path,
				};

				return this._categories.update(this.payload.id, category);
			})
		);

		return this._loading.add(undoTask);
	}

	private _openDialog() {
		return this._dialog
			.open<NewCategoryDialogComponent, ICategory, INewCategoryDialogResult>(
				NewCategoryDialogComponent,
				{ width: '300px', data: this.payload }
			)
			.afterClosed()
			.pipe(
				take(1),
				filter(dialogResult => !isNullish(dialogResult))
			);
	}

	private _saveIcon(): Observable<void> {
		return from(fetch(this.payload.icon)).pipe(
			switchMap(res => from(res.blob())),
			map(blob => new File([blob], this.payload.id, { type: blob.type })),
			tap(icon => (this._icon = icon)),
			mapTo(null)
		);
	}

	private _uploadIcon(icon: File) {
		return this._categories.uploadIcon(icon, this.payload.id);
	}
}
