import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreCollectionsInfoConverter } from '@common/firebase/firestore/collections-info-converter';
import { ICollectionInfo } from '@interfaces/collection-info';
import {
	Collection,
	List,
	ListMixin,
	Read,
	ReadMixin,
} from '@models/collection';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
