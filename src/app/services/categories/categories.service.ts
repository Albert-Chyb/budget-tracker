import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { first, switchMap } from 'rxjs/operators';
import { FirebaseCallableFunctionsNames } from 'src/app/common/firebase-callable-functions';
import { ICategory, ICategoryBase } from 'src/app/common/interfaces/category';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class CategoriesService {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _user: UserService,
		private readonly _afFunctions: AngularFireFunctions
	) {}

	async create(category: ICategoryBase, id?: string): Promise<void> {
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

	async update(id: string, category: Partial<ICategoryBase>) {
		const uid = await this._user.getUid();

		return this._afStore
			.doc<ICategory>(`users/${uid}/categories/${id}`)
			.update(category);
	}

	async delete(id: string): Promise<any> {
		const deleteCategory = this._afFunctions.httpsCallable(
			FirebaseCallableFunctionsNames.DeleteCategory
		);
		const res = await deleteCategory({ id }).pipe(first()).toPromise();

		if (res.result === 'success') {
			return Promise.resolve();
		} else {
			throw res;
		}
	}
}
