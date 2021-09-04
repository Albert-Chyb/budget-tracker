import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { ICategory, INewCategory } from 'src/app/common/interfaces/category';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class CategoriesService {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _user: UserService
	) {}

	async create(category: INewCategory): Promise<DocumentReference<ICategory>> {
		const uid = await this._user.getUid();
		const cat = { ...category, isHidden: false };

		return this._afStore.collection(`users/${uid}/categories`).add(cat) as any;
	}

	read(id: string) {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this._afStore
						.doc<ICategory>(`users/${uid}/categories/${id}`)
						.valueChanges({ idField: 'id' })
				)
			);
	}

	readAll() {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this._afStore
						.collection<ICategory>(`users/${uid}/categories`, query =>
							query.where('isHidden', '==', false)
						)
						.valueChanges({ idField: 'id' })
				)
			);
	}

	async update(id: string, category: Partial<INewCategory>) {
		const uid = await this._user.getUid();

		return this._afStore
			.doc<ICategory>(`users/${uid}/categories/${id}`)
			.update(category);
	}

	async delete(id: string) {
		const uid = await this._user.getUid();
		const categoryRef = this._afStore.doc<ICategory>(
			`users/${uid}/categories/${id}`
		);

		// TODO: Check if transactions collection has a transaction with passed category.
		// If there are none delete the category otherwise, set its isHidden property to true.

		return categoryRef.update({ isHidden: true });
	}
}
