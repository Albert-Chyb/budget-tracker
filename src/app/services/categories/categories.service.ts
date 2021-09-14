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

		return this._afStore
			.collection(`users/${uid}/categories`)
			.add(category) as any;
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
						.collection<ICategory>(`users/${uid}/categories`)
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
		// TODO: Write a cloud function that checks if a category is referenced by a transaction.
		/*
			If a category is referenced by at least by a one transaction, it cannot be removed.
			If not it can be safely removed from collection.
		*/

		throw new Error('Deleting categories is not implemented yet.');
	}
}
