import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseError } from 'src/app/common/errors/firebase-errors';
import { GlobalErrorHandler } from 'src/app/common/global-error-handler';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private readonly _afAuth: AngularFireAuth,
		private readonly _errorHandler: GlobalErrorHandler
	) {}

	private readonly _isLoggedIn$: Observable<boolean> = this._afAuth.user.pipe(
		map(user => !!user)
	);

	async loginWithGoogle() {
		const googleProvider = new firebase.auth.GoogleAuthProvider();

		return this._executeAuthorization(() =>
			this._signInWithProvider(googleProvider)
		);
	}

	async loginAnonymously() {
		return this._executeAuthorization(() => this._afAuth.signInAnonymously());
	}

	async convertAnonymousAccountToPermanent() {
		const user = await this._afAuth.currentUser;
		if (!user) throw new Error('User is not logged in !');

		const googleProvider = new firebase.auth.GoogleAuthProvider();

		return this._executeAuthorization(() => user.linkWithPopup(googleProvider));
	}

	logout() {
		this._afAuth.signOut();
	}

	private async _executeAuthorization(
		handler: () => Promise<any>
	): Promise<[firebase.auth.UserCredential | null, FirebaseError | null]> {
		let credential: firebase.auth.UserCredential | null = null;
		let error: FirebaseError | null = null;

		try {
			await handler();
		} catch (ex) {
			error = new FirebaseError(ex);
			this._errorHandler.handleError(error);
		}

		return [credential, error];
	}

	private _signInWithProvider(provider: firebase.auth.AuthProvider) {
		return this._afAuth.signInWithPopup(provider);
	}

	get isLoggedIn$() {
		return this._isLoggedIn$;
	}
}
