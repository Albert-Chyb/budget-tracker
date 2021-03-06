import {
	collection,
	collectionData,
	CollectionReference,
	deleteDoc,
	doc,
	docData,
	DocumentData,
	DocumentReference,
	Firestore,
	FirestoreDataConverter,
	getDoc,
	query,
	QueryConstraint,
	QueryDocumentSnapshot,
	setDoc,
	SnapshotOptions,
	updateDoc,
} from '@angular/fire/firestore';
import { AppError } from '@common/errors/app-error';
import { ErrorCode } from '@common/errors/error-code';
import { generateUniqueString } from '@common/helpers/generateUniqueString';
import { from, Observable } from 'rxjs';
import { map, mapTo, shareReplay, switchMap } from 'rxjs/operators';

type Constructor<T> = new (...args: any[]) => T;

export const ALL_MIXINS = [
	CreateMixin,
	ReadMixin,
	ListMixin,
	UpdateMixin,
	DeleteMixin,
	PutMixin,
];

/**
 * @template T Required object to create a document.
 * @template K Object that is present in the AngularFirestoreDocument.
 */
export interface Create<T = unknown, K = unknown> {
	/**
	 * Creates a document in the database.
	 * @param data Document data
	 * @param id Id of the document (generated automatically if not present).
	 */
	create(data: T, id?: string): Observable<DocumentReference<K>>;
}

/**
 * @template T Object that is present in the observable.
 */
export interface Read<T = unknown> {
	/**
	 * Reads a single document from the database.
	 *
	 * @param id Id of the document.
	 * @param once If false, object is read in real-time.
	 */
	read(id: string, once?: boolean): Observable<T>;
}

/**
 * @template T Objects that are present in the observable.
 */
export interface List<T = unknown> {
	/** Reads all documents from the database. */
	list(): Observable<T[]>;

	query(...queries: QueryConstraint[]): Observable<T[]>;
}

/**
 * @template T Required object to update a document.
 */
export interface Update<T = unknown> {
	/** Updates a document in the database. */
	update(id: string, data: T): Observable<void>;
}

/**
 * @template T Required object to create a document.
 */
export interface Put<T = unknown> {
	/** Creates or overwrites a document in the database. */
	put(id: string, data: T): Observable<void>;
}

export interface Delete {
	/** Deletes a document from the database. */
	delete(id: string): Observable<void>;
}

/** Default converter for firestore collection. It just appends ids to documents. */
export class FirestoreConverter implements FirestoreDataConverter<unknown> {
	toFirestore(modelObject: unknown): DocumentData;
	toFirestore(modelObject: any, options?: any): DocumentData {
		return modelObject;
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot<DocumentData>,
		options: SnapshotOptions
	): { id: string } & unknown {
		return {
			id: snapshot.id,
			...snapshot.data(),
		};
	}
}

/** Base class for all firestore collection mixins. */
export class FirestoreCollection {
	public readonly collection$: Observable<CollectionReference<unknown>>;

	constructor(
		protected readonly _afStore: Firestore,
		private readonly _path$: Observable<string>,
		protected readonly _converter: FirestoreDataConverter<unknown> = new FirestoreConverter()
	) {
		this.collection$ = this._path$.pipe(
			map(path =>
				collection(this._afStore, path).withConverter(this._converter)
			),
			shareReplay(1)
		);
	}

	generateId(): string {
		return generateUniqueString();
	}

	exists(id: string): Observable<boolean> {
		return this.collection$.pipe(
			switchMap(collection => from(getDoc(doc(collection, id)))),
			map(snapshot => snapshot.exists())
		);
	}
}

/** Allows to create documents in the collection. */
export function CreateMixin<TBase extends Constructor<FirestoreCollection>>(
	Base: TBase
) {
	return class extends Base implements Create<unknown> {
		create(
			data: DocumentData,
			id?: string
		): Observable<DocumentReference<unknown>> {
			return this.collection$.pipe(
				switchMap(coll => {
					const docId = id ?? this.generateId();
					const docRef = doc(coll, docId);

					return from(setDoc(docRef, data)).pipe(mapTo(docRef));
				})
			);
		}
	};
}

/** Allows to read a single document from the collection. */
export function ReadMixin<TBase extends Constructor<FirestoreCollection>>(
	Base: TBase
) {
	return class extends Base implements Read<unknown> {
		read(id: string, once = false): Observable<unknown> {
			return this.collection$.pipe(
				switchMap(coll => {
					const docRef = doc(coll, id);

					return once
						? from(getDoc(docRef)).pipe(map(doc => doc.data()))
						: docData(docRef);
				})
			);
		}
	};
}

/** Allows to read all documents in the collection. */
export function ListMixin<TBase extends Constructor<FirestoreCollection>>(
	Base: TBase
) {
	return class extends Base implements List<unknown> {
		list(): Observable<unknown[]> {
			return this.collection$.pipe(switchMap(coll => collectionData(coll)));
		}

		query(...queries: QueryConstraint[]): Observable<unknown[]> {
			return this.collection$.pipe(
				switchMap(coll => {
					return collectionData(query(coll, ...queries));
				})
			);
		}
	};
}

/** Allows to update documents in the collection. */
export function UpdateMixin<TBase extends Constructor<FirestoreCollection>>(
	Base: TBase
) {
	return class extends Base implements Update<unknown> {
		update(id: string, data: DocumentData): Observable<void> {
			return this.collection$.pipe(
				switchMap(coll => {
					const docRef = doc(coll, id);

					return from(getDoc(docRef)).pipe(
						switchMap(document => {
							if (document.exists()) {
								return from(
									updateDoc(docRef, this._converter.toFirestore(data))
								);
							} else {
								throw new AppError(
									'Cannot update a non existing document.',
									ErrorCode.DatabaseObjectNotFound
								);
							}
						})
					);
				})
			);
		}
	};
}

/** Allows to create or overwrite a document in the collection. */
export function PutMixin<TBase extends Constructor<FirestoreCollection>>(
	Base: TBase
) {
	return class extends Base implements Put<unknown> {
		put(id: string, data: DocumentData): Observable<void> {
			return this.collection$.pipe(
				switchMap(coll => {
					const docRef = doc(coll, id);

					return from(setDoc(docRef, data));
				})
			);
		}
	};
}

/** Allows to delete a document in the collection. */
export function DeleteMixin<TBase extends Constructor<FirestoreCollection>>(
	Base: TBase
) {
	return class extends Base implements Delete {
		delete(id: string): Observable<void> {
			return this.collection$.pipe(
				switchMap(coll => {
					const docRef = doc(coll, id);

					return from(deleteDoc(docRef));
				})
			);
		}
	};
}

export function Collection<T>(
	...mixins: any[]
): new (
	_afStore: Firestore,
	path$: Observable<string>,
	converter?: FirestoreDataConverter<unknown>
) => FirestoreCollection & T {
	return mixins.reduce((Base, Mixin) => Mixin(Base), FirestoreCollection);
}
