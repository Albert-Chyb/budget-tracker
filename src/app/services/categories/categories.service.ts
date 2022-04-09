import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { CloudFunction } from 'src/app/common/firebase/cloud-functions/callable-functions';
import {
	ICategory,
	ICategoryCreatePayload,
	ICategoryUpdatePayload,
} from 'src/app/common/interfaces/category';
import {
	ALL_MIXINS,
	Collection,
	Create,
	Delete,
	List,
	Put,
	Read,
	Update,
} from 'src/app/common/models/collection';
import { UserService } from '../user/user.service';

interface Methods
	extends Create<ICategoryCreatePayload, ICategory>,
		Read<ICategory>,
		List<ICategory>,
		Update<ICategoryUpdatePayload>,
		Delete,
		Put<ICategoryCreatePayload> {}

@Injectable({
	providedIn: 'root',
})
export class CategoriesService extends Collection<Methods>(...ALL_MIXINS) {
	constructor(
		afStore: Firestore,
		user: UserService,
		private readonly _afFunctions: Functions
	) {
		super(afStore, user.getUid$().pipe(map(uid => `/users/${uid}/categories`)));
	}

	delete(id: string): Observable<void> {
		const deleteCategory = httpsCallable(
			this._afFunctions,
			CloudFunction.DeleteCategory
		);

		return from(deleteCategory({ id })).pipe(
			map((res: any) => {
				if (res.result === 'error') {
					throw res;
				}
			}),
			mapTo(null)
		);
	}
}
