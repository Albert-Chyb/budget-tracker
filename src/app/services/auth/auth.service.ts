import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { FirebaseError } from 'src/app/common/errors/firebase-errors';
import { GlobalErrorHandler } from 'src/app/common/global-error-handler';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private readonly _afAuth: AngularFireAuth,
		private readonly _errorHandler: GlobalErrorHandler,
		private readonly _user: UserService,
		private readonly _router: Router
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

	async logout() {
		await this._afAuth.signOut();
		// Wait until user$ observable emits null which means that user data is no longer present (only then app can be sure that the user is logged out).
		await this._user.user$
			.pipe(
				filter(user => !user),
				take(1)
			)
			.toPromise();

		this._router.navigateByUrl('/login');
	}

	private async _executeAuthorization(
		handler: () => Promise<any>
	): Promise<[firebase.auth.UserCredential | null, FirebaseError | null]> {
		let credential: firebase.auth.UserCredential | null = null;
		let error: FirebaseError | null = null;

		try {
			await handler();

			// Wait until user data of the newly logged in user is stored in the user$ observable (only then app can be sure that the user is logged in).
			await this._user.user$
				.pipe(
					filter(user => !!user),
					take(1)
				)
				.toPromise();

			this._router.navigateByUrl('/');
		} catch (ex) {
			error = new FirebaseError(ex as any);
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
