import firebase from 'firebase/app';

export type Timestamp = firebase.firestore.Timestamp;
export type FieldValue = firebase.firestore.FieldValue;
export type DocumentData = firebase.firestore.DocumentData;
export type FirestoreDataConverter<T> =
	firebase.firestore.FirestoreDataConverter<T>;
export type QueryDocumentSnapshot<T> =
	firebase.firestore.QueryDocumentSnapshot<T>;
