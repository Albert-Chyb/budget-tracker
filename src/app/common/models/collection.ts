import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument,
	DocumentData,
} from '@angular/fire/firestore';
import firebase from 'firebase';
import { from, Observable } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import {
	FirestoreDataConverter,
	QueryDocumentSnapshot,
} from '../interfaces/firestore';

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
	create(data: T, id?: string): Observable<AngularFirestoreDocument<K>>;
}

/**
 * @template T Object that is present in the observable.
 */
export interface Read<T = unknown> {
	/**
	 * Reads a single document from the database.
	 *
	 * @param id Id of the document.
	 * @param once If true, object is read in real-time.
	 */
	read(id: string, once?: boolean): Observable<T>;
}

/**
 * @template T Objects that are present in the observable.
 */
export interface List<T = unknown> {
	/** Reads all documents from the database. */
	list(): Observable<T[]>;
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
		options: firebase.firestore.SnapshotOptions
	): { id: string } & unknown {
		return {
			id: snapshot.id,
			...snapshot.data(),
		};
	}
}

/** Base class for all firestore collection mixins. */
export class FirestoreCollection {
	protected collection$: Observable<AngularFirestoreCollection<unknown>>;

	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _path$: Observable<string>,
		private readonly _converter: FirestoreDataConverter<unknown> = new FirestoreConverter()
	) {
		this.collection$ = this._path$.pipe(
			map(path => {
				const collRef = this._afStore
					.collection(path)
					.ref.withConverter(this._converter);

				return this._afStore.collection(collRef);
			})
		);
	}

	generateId(): string {
		return this._afStore.createId();
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
		): Observable<AngularFirestoreDocument<unknown>> {
			return this.collection$.pipe(
				switchMap(coll => {
					const docId = id ?? this.generateId();
					const docRef = coll.doc(docId);

					return from(docRef.set(data)).pipe(mapTo(docRef));
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
					const docRef = coll.doc(id);

					return once
						? docRef.get().pipe(map(doc => doc.data()))
						: docRef.valueChanges();
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
			return this.collection$.pipe(switchMap(coll => coll.valueChanges()));
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
				switchMap(coll =>
					coll
						.doc(id)
						.get()
						.pipe(
							switchMap(doc => {
								if (doc.exists) {
									return from(doc.ref.update(data));
								} else {
									throw new Error(`Cannot update a non existing document.`);
								}
							})
						)
				)
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
				switchMap(coll => from(coll.doc(id).set(data)))
			);
		}
	};
}

/** Allows to delete a document in the collection. */
export function DeleteMixin<TBase extends Constructor<FirestoreCollection>>(
	Base: TBase
) {
	return class Delete extends Base {
		delete(id: string): Observable<void> {
			return this.collection$.pipe(
				switchMap(coll => from(coll.doc(id).delete()))
			);
		}
	};
}

export function Collection<T>(
	...mixins: any[]
): new (
	_afStore: AngularFirestore,
	path$: Observable<string>,
	converter?: FirestoreDataConverter<unknown>
) => FirestoreCollection & T {
	return mixins.reduce((Base, Mixin) => Mixin(Base), FirestoreCollection);
}
