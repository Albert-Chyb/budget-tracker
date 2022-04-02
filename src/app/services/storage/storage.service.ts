import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
	ref,
	Storage,
	uploadBytesResumable,
	UploadTask,
	UploadTaskSnapshot,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { generateUniqueString } from 'src/app/common/helpers/generateUniqueString';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	constructor(
		private readonly _afStorage: Storage,
		private readonly _user: UserService,
		private readonly _afStore: Firestore
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
		const fileName = name ?? this._createId();
		const uid = await this._user.getUid();
		const reference = ref(this._afStorage, `${uid}/${folder}/${fileName}`);
		const task = uploadBytesResumable(reference, file);

		return {
			progress$: this._createProgressObservable(task),
			snapshot$: this._createSnapshotObservable(task),
			snapshot: task.snapshot,
		};
	}

	private _createSnapshotObservable(
		task: UploadTask
	): Observable<UploadTaskSnapshot> {
		return new Observable(subscriber => {
			task.on(
				'state_changed',
				snap => subscriber.next(snap),
				error => subscriber.error(error),
				() => subscriber.complete()
			);
		});
	}

	private _createProgressObservable(task: UploadTask): Observable<number> {
		return new Observable(subscriber => {
			task.on(
				'state_changed',
				snap => {
					subscriber.next(snap.bytesTransferred / snap.totalBytes);
				},
				error => subscriber.error(error),
				() => subscriber.complete()
			);
		});
	}

	private _createId() {
		return generateUniqueString();
	}
}
