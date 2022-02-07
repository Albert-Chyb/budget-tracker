import firebase from 'firebase/compat/app';

export interface FirebaseError {
	type: string;
}
export class FirebaseError extends Error implements firebase.FirebaseError {
	constructor(error: firebase.FirebaseError) {
		super(error.message);
		Object.setPrototypeOf(this, FirebaseError.prototype);

		this.code = error.code;
		this.message = error.message;
		this.name = error.name;
		this.stack = error.stack;
	}

	code: string;
	message: string;
	name: string | any;
	stack?: string | undefined;
}
