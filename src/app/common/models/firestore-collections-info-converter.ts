import firebase from 'firebase/compat';
import { ICollectionInfo } from '../interfaces/collection-info';
import { FirestoreDataConverter } from '../interfaces/firestore';

export class FirestoreCollectionsInfoConverter
	implements FirestoreDataConverter<ICollectionInfo>
{
	toFirestore(modelObject: ICollectionInfo): firebase.firestore.DocumentData;
	toFirestore(
		modelObject: Partial<ICollectionInfo>,
		options: firebase.firestore.SetOptions
	): firebase.firestore.DocumentData;
	toFirestore(
		modelObject: any,
		options?: any
	): firebase.firestore.DocumentData {
		throw new Error(
			'You cannot perform write operations on the collections-info collection.'
		);
	}

	fromFirestore(
		snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
		options: firebase.firestore.SnapshotOptions
	): ICollectionInfo {
		const receivedInfo = snapshot.data();

		return {
			docCount: receivedInfo?.docCount ?? 0,
			distinct: receivedInfo?.distinct ?? [],
		};
	}
}
