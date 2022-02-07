import {
	Action,
	AngularFirestore,
	DocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/*
	Test this function in critical scenarios.
	* A child doc does not exists.
	* The field in the primary doc is nullish or falsy

	Create TS types.
*/

export function leftJoin(
	afStore: AngularFirestore,
	references: { [key: string]: string }
) {
	return (source: Observable<any[]>) =>
		source.pipe(
			switchMap(docs => {
				// Get ids of all child documents that will be joined with the main docs.
				// We store them in a Set to eliminate duplicate reads (when 2 documents referencing the same child).

				const foreignDocumentsIds = new Map<string, Set<string>>();

				for (const doc of docs) {
					for (const foreignKeyFieldName of Object.keys(references)) {
						if (foreignKeyFieldName in doc) {
							const childId = doc[foreignKeyFieldName];

							if (!foreignDocumentsIds.has(foreignKeyFieldName)) {
								foreignDocumentsIds.set(foreignKeyFieldName, new Set());
							}

							foreignDocumentsIds.get(foreignKeyFieldName).add(childId);
						}
					}
				}

				// Build read calls based on the provided paths in the { references } parameter.
				// They are retrieved as snapshots, to easily access their ids.

				const reads: Observable<Action<DocumentSnapshot<any>>>[] = [];

				for (const [
					foreignKeyFieldName,
					ids,
				] of foreignDocumentsIds.entries()) {
					for (const id of ids.values()) {
						reads.push(
							afStore
								.doc(`${references[foreignKeyFieldName]}/${id}`)
								.snapshotChanges()
						);
					}
				}

				// Actual call to the firestore.
				// We are transforming default array to a Map, to speed up finding the right document in the next map() operator.
				// (Depending on the number of children, searching through array using the Array.find() method, would be slower).

				return combineLatest(reads).pipe(
					map(foreignDocuments => {
						const foreignDocumentsMap = new Map<
							string,
							Action<DocumentSnapshot<any>>
						>();

						for (const doc of foreignDocuments) {
							foreignDocumentsMap.set(doc.payload.id, doc.payload.data());
						}

						return foreignDocumentsMap;
					}),
					map(foreignDocuments => [docs, foreignDocuments])
				);
			}),
			map(([primaryCollection, foreignDocuments]) => {
				//! Remember to work here with immutable data.

				return (primaryCollection as any[]).map(doc => {
					const joinedDoc = { ...doc };

					Object.keys(references).forEach(
						key =>
							(joinedDoc[key] = (
								foreignDocuments as Map<string, Action<DocumentSnapshot<any>>>
							).get(doc[key]))
					);

					return joinedDoc;
				});
			})
		);
}
