import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ICollectionInfo } from 'src/app/common/interfaces/collection-info';
import {
	Collection,
	List,
	ListMixin,
	Read,
	ReadMixin,
} from 'src/app/common/models/collection';
import { FirestoreCollectionsInfoConverter } from 'src/app/common/models/firestore-collections-info-converter';
import { UserService } from '../user/user.service';

interface Methods extends Read<ICollectionInfo>, List<ICollectionInfo> {}

@Injectable({
	providedIn: 'root',
})
export class CollectionsInfoService extends Collection<Methods>(
	ReadMixin,
	ListMixin
) {
	constructor(afStore: AngularFirestore, user: UserService) {
		super(
			afStore,
			user.getUid$().pipe(switchMap(uid => of(`users/${uid}/info`))),
			new FirestoreCollectionsInfoConverter()
		);
	}
}
