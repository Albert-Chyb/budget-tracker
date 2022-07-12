import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { getDownloadURL } from '@angular/fire/storage';
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
import { StorageService } from '@services/storage/storage.service';
import { UserService } from '@services/user/user.service';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';

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
		private readonly _storage: StorageService
	) {
		super(afStore, user.getUid$().pipe(map(uid => `/users/${uid}/categories`)));
	}

	delete(id: string): Observable<void> {
		const deleteCategory = httpsCallable(
			this._afFunctions,
			CloudFunction.DeleteCategory
		);

		return from(deleteCategory({ id })).pipe(
			catchError(this._catchError),
			mapTo(null)
		);
	}

	/**
	 * Uploads an icon.
	 *
	 * @param icon Icon that will be uploaded to the storage.
	 * @returns Url to the file.
	 */
	uploadIcon(
		icon: File,
		id: string
	): Observable<{ url: string; path: string }> {
		const upload = this._storage.upload('categories-icons', icon, id);

		return upload.pipe(
			switchMap(uploadResult =>
				from(getDownloadURL(uploadResult.ref)).pipe(
					map(url => ({
						url,
						path: uploadResult.metadata.fullPath,
					}))
				)
			)
		);
	}

	downloadIcon(id: string): Observable<File> {
		return this._storage.downloadFile(`categories-icons/${id}`);
	}

	private _catchError(error: any): Observable<any> {
		let exception: any = error;

		if (error instanceof FirebaseError && error.code === 'functions/aborted') {
			exception = new AppError(
				'The category could not be deleted, because it is referenced by at least one transaction.',
				ErrorCode.CategoryReferenced
			);
		}

		return throwError(exception);
	}
}
