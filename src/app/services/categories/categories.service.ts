import { ErrorHandler, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { AppError } from '@common/errors/app-error';
import { ErrorCode } from '@common/errors/error-code';
import { CloudFunction } from '@common/firebase/cloud-functions/callable-functions';
import {
	ICategory,
	ICategoryCreatePayload,
	ICategoryUpdatePayload,
} from '@interfaces/category';
import {
	ALL_MIXINS,
	Collection,
	Create,
	Delete,
	List,
	Put,
	Read,
	Update,
} from '@models/collection';
import { UserService } from '@services/user/user.service';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';

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
		private readonly _afFunctions: Functions,
		private readonly _errorHandler: ErrorHandler
	) {
		super(afStore, user.getUid$().pipe(map(uid => `/users/${uid}/categories`)));
	}

	delete(id: string): Observable<void> {
		const deleteCategory = httpsCallable(
			this._afFunctions,
			CloudFunction.DeleteCategory
		);

		return from(deleteCategory({ id })).pipe(
			catchError(error => {
				this._handleError(error);

				return of(null);
			}),
			mapTo(null)
		);
	}

	private _handleError(error: any) {
		if (error instanceof FirebaseError && error.code === 'functions/aborted') {
			this._errorHandler.handleError(
				new AppError(
					'The category could not be deleted, because it is referenced by at least one transaction.',
					ErrorCode.CategoryReferenced
				)
			);
		} else {
			this._errorHandler.handleError(error);
		}
	}
}
