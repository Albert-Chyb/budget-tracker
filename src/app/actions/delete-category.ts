import { ICategory } from '@common/interfaces/category';
import { CategoriesService } from '@services/categories/categories.service';
import { LoadingService } from '@services/loading/loading.service';
import { Observable } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';
import { ActionDefinition } from './action-definition';

export class DeleteCategoryAction extends ActionDefinition<ICategory> {
	private readonly _categories = this.getDependency(CategoriesService);
	private readonly _loading = this.getDependency(LoadingService);
	private _icon: File;

	onCompleteMsg: string = `Usunięto categorię: ${this.payload.name}`;

	execute(): void | Observable<void> | Promise<void> {
		const { id } = this.payload;

		return this._loading.add(
			this._categories.downloadIcon(id).pipe(
				tap(icon => (this._icon = icon)),
				switchMap(() => this._categories.delete(id))
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
						},
						this.payload.id
					)
				),
				mapTo(null)
			)
		);
	}
}
