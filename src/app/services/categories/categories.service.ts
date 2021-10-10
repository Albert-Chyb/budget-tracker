import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { FirebaseCallableFunctionsNames } from 'src/app/common/firebase-callable-functions';
import {
	ICategory,
	ICategoryCreatePayload,
	ICategoryReadPayload,
	ICategoryUpdatePayload,
} from 'src/app/common/interfaces/category';
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

	async create(category: ICategoryCreatePayload, id?: string): Promise<void> {
		const uid = await this._user.getUid();
		const docID = id ?? this._afStore.createId();
		const docRef = await this._afStore
			.doc<ICategoryReadPayload>(`users/${uid}/categories/${docID}`)
			.ref.get();

		if (docRef.exists) {
			throw new Error(
				`A category with this id ${id} already exists in the firestore.`
			);
		}

		return docRef.ref.set(category);
	}

	read(id: string): Observable<ICategory> {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this._afStore
						.doc<ICategoryReadPayload>(`users/${uid}/categories/${id}`)
						.valueChanges({ idField: 'id' })
				)
			);
	}

	readAll(): Observable<ICategory[]> {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this._afStore
						.collection<ICategoryReadPayload>(
							`users/${uid}/categories`,
							query => query.orderBy('name', 'asc')
						)
						.valueChanges({ idField: 'id' })
				)
			);
	}

	async update(id: string, category: ICategoryUpdatePayload): Promise<void> {
		const uid = await this._user.getUid();

		return this._afStore
			.doc<ICategoryReadPayload>(`users/${uid}/categories/${id}`)
			.update(category);
	}

	async delete(id: string): Promise<void> {
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
