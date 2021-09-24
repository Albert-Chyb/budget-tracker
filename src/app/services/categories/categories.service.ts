import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

	async create(category: INewCategory, id?: string): Promise<void> {
		const uid = await this._user.getUid();
		const docID = id ?? this._afStore.createId();
		const docRef = await this._afStore
			.doc(`users/${uid}/categories/${docID}`)
			.ref.get();

		if (docRef.exists) {
			throw new Error(
				`A category with this id ${id} already exists in the firestore.`
			);
		}

		return docRef.ref.set(category);
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
							query.orderBy('name', 'asc')
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
		// TODO: Write a cloud function that checks if a category is referenced by a transaction.
		/*
			If a category is referenced by at least by a one transaction, it cannot be removed.
			If not it can be safely removed from collection.
		*/

		throw new Error('Deleting categories is not implemented yet.');
	}
}
