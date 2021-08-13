import firebase from 'firebase/app';

/**
 * Represents a user in the database.
 */
export interface IUser {
	displayName: string;
	email: string;
	emailVerified: boolean;
	isAnonymous: boolean;
	photoURL: string;
	createdAt: firebase.firestore.FieldValue;
}
