import { ICategory } from '@common/interfaces/category';
import { CategoriesService } from '@services/categories/categories.service';
import { LoadingService } from '@services/loading/loading.service';
import { from, Observable } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';
import { ActionDefinition } from './action-definition';

export class DeleteCategoryAction extends ActionDefinition<ICategory> {
	private readonly _categories = this.getDependency(CategoriesService);
	private readonly _loading = this.getDependency(LoadingService);
	private _icon: File;

	onCompleteMsg: string = `Usunięto categorię: ${this.payload.name}`;

	execute(): void | Observable<void> | Promise<void> {
		return this._loading.add(
			this._downloadIcon().pipe(
				tap(blob => {
					this._icon = new File([blob], this.payload.id, {
						type: blob.type,
					});
				}),
				switchMap(() => this._categories.delete(this.payload.id))
			)
		);
	}

	undo(): void | Observable<void> | Promise<void> {
		return this._loading.add(
			this._categories.uploadIcon(this._icon, this.payload.id).pipe(
				switchMap(uploadSnapshot =>
					this._categories.create(
						{
							name: this.payload.name,
							defaultTransactionsType: this.payload.defaultTransactionsType,
							icon: uploadSnapshot.url,
							iconPath: uploadSnapshot.path,
						},
						this.payload.id
					)
				),
				mapTo(null)
			)
		);
	}

	private _downloadIcon(): Observable<Blob> {
		return from(fetch(this.payload.icon).then(res => res.blob()));
	}
}
