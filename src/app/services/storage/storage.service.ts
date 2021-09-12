import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
	AngularFireStorage,
	AngularFireUploadTask,
} from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	constructor(
		private readonly _afStorage: AngularFireStorage,
		private readonly _user: UserService,
		private readonly _afStore: AngularFirestore
	) {}

	/**
	 * Uploads a file to one of the user's folders.
	 *
	 * @param folder Path to the folder
	 * @param file File to upload
	 * @param name Name that the file will be saved under (unique string is generated automatically if it's unspecified)
	 * @returns An object with useful observables.
	 */
	async upload(folder: string, file: File, name?: string) {
		const fileName = name ?? this._afStore.createId();
		const uid = await this._user.getUid();
		const reference = this._afStorage.ref(`${uid}/${folder}/${fileName}`);
		const task = reference.put(file);

		return {
			progress$: task.percentageChanges(),
			snapshot$: task.snapshotChanges(),
			getURL$: this._getURL(task),
		};
	}

	private _getURL(task: AngularFireUploadTask): Observable<string> {
		return task.snapshotChanges().pipe(
			filter(snap => snap.bytesTransferred === snap.totalBytes),
			switchMap(snap => from(snap.ref.getDownloadURL())),
			take(1)
		);
	}
}
