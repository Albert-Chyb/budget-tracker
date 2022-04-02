import { FieldValue, Timestamp } from '@angular/fire/firestore';

/**
 * Represents a general user object.
 */
export interface IUserBase {
	displayName: string;
	email: string;
	emailVerified: boolean;
	isAnonymous: boolean;
	photoURL: string;
}

/**
 * Represents an user object that is returned from a service.
 */
export interface IUser extends IUserBase {
	uid: string;
	createdAt: Date;
}

/**
 * Represents an object that aims to create a new user in the database.
 */
export interface IUserCreatePayload extends IUserBase {
	createdAt: FieldValue;
}

/**
 * Represents an object that aims to update already existing user in the database.
 */
export interface IUserUpdatePayload extends Partial<IUserBase> {}

/**
 * Represents a raw user object that is returned from the database.
 */
export interface IUserReadPayload extends IUserBase {
	createdAt: Timestamp;
}
