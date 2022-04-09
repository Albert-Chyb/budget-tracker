import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FirestoreCollectionsInfoConverter } from 'src/app/common/firebase/firestore/collections-info-converter';
import { ICollectionInfo } from 'src/app/common/interfaces/collection-info';
import {
	Collection,
	List,
	ListMixin,
	Read,
	ReadMixin,
} from 'src/app/common/models/collection';
import { UserService } from '../user/user.service';

interface Methods extends Read<ICollectionInfo>, List<ICollectionInfo> {}

@Injectable({
	providedIn: 'root',
})
export class CollectionsInfoService extends Collection<Methods>(
	ReadMixin,
	ListMixin
) {
	constructor(afStore: Firestore, user: UserService) {
		super(
			afStore,
			user.getUid$().pipe(switchMap(uid => of(`users/${uid}/info`))),
			new FirestoreCollectionsInfoConverter()
		);
	}
}
