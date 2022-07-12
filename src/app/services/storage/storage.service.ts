import { Injectable } from '@angular/core';
import {
	getBlob,
	ref,
	Storage,
	uploadBytes,
	uploadBytesResumable,
	UploadResult,
	UploadTask,
	UploadTaskSnapshot,
} from '@angular/fire/storage';
import { generateUniqueString } from '@helpers/generateUniqueString';
import { UserService } from '@services/user/user.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	constructor(
		private readonly _afStorage: Storage,
		private readonly _user: UserService
	) {}

	/**
	 * Uploads a file to one of the user's folders.
	 *
	 * @param folder Path to the folder
	 * @param file File to upload
	 * @param name Name that the file will be saved under (unique string is generated automatically if it's unspecified)
	 * @returns An object with useful observables.
	 */
	uploadResumable(folder: string, file: File, name?: string) {
		const fileName = name ?? this._createId();
		const uid = this._user.getUid();
		const reference = ref(this._afStorage, `${uid}/${folder}/${fileName}`);
		const task = uploadBytesResumable(reference, file);

		return {
			progress$: this._createProgressObservable(task),
			snapshot$: this._createSnapshotObservable(task),
			snapshot: task.snapshot,
		};
	}

	upload(folder: string, file: File, name?: string): Observable<UploadResult> {
		const fileName = name ?? this._createId();
		const uid = this._user.getUid();
		const reference = ref(this._afStorage, `${uid}/${folder}/${fileName}`);
		const task = uploadBytes(reference, file);

		return from(task);
	}

	downloadFile(folder: string): Observable<File> {
		const uid = this._user.getUid();
		const fileRef = ref(this._afStorage, `${uid}/${folder}`);

		return from(getBlob(fileRef)).pipe(
			map(blob => new File([blob], fileRef.name, { type: blob.type }))
		);
	}

	private _createSnapshotObservable(
		task: UploadTask
	): Observable<UploadTaskSnapshot> {
		return new Observable(subscriber => {
			task.on(
				'state_changed',
				snap => subscriber.next(snap),
				error => subscriber.error(error),
				() => {
					subscriber.next(task.snapshot);
					subscriber.complete();
				}
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
