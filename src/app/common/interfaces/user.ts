import { FieldValue, Timestamp } from './firestore';

/**
 * Contains fields that are present in all payloads.
 */
export interface IUserBase {
	displayName: string;
	email: string;
	emailVerified: boolean;
	isAnonymous: boolean;
	photoURL: string;
}

/**
 * User object that is returned from a service.
 */
export interface IUser extends IUserBase {
	uid: string;
	createdAt: Date;
}

/**
 * Shape of an user object that is required when the client wants to create a new user.
 */
export interface IUserCreatePayload extends IUserBase {
	createdAt: FieldValue;
}

/**
 * Shape of an user object that is required when the client wants to update an user.
 */
export interface IUserUpdatePayload extends Partial<IUserBase> {}

/**
 * Shape of an user object that is returned from the database.
 */
export interface IUserReadPayload extends IUserBase {
	createdAt: Timestamp;
}
