import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SetOptions,
	SnapshotOptions,
} from '@angular/fire/firestore';
import { ICollectionInfo } from '@interfaces/collection-info';

export class FirestoreCollectionsInfoConverter
	implements FirestoreDataConverter<ICollectionInfo>
{
	toFirestore(modelObject: ICollectionInfo): DocumentData;
	toFirestore(
		modelObject: Partial<ICollectionInfo>,
		options: SetOptions
	): DocumentData;
	toFirestore(modelObject: any, options?: any): DocumentData {
		throw new Error(
			'You cannot perform write operations on the collections-info collection.'
		);
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot<DocumentData>,
		options: SnapshotOptions
	): ICollectionInfo {
		const receivedInfo = snapshot.data();

		return {
			docCount: receivedInfo?.docCount ?? 0,
			distinct: receivedInfo?.distinct ?? [],
		};
	}
}
