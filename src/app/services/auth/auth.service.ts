import { Injectable } from '@angular/core';
import {
	Auth,
	GoogleAuthProvider,
	linkWithPopup,
	signInAnonymously,
	signInWithPopup,
	updateCurrentUser,
	updateProfile,
	user,
	UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private readonly _afAuth: Auth,
		private readonly _user: UserService,
		private readonly _router: Router
	) {}

	private readonly _isLoggedIn$: Observable<boolean> = user(this._afAuth).pipe(
		map(user => !!user)
	);

	loginWithGoogle(): Promise<UserCredential> {
		const googleProvider = new GoogleAuthProvider();

		return this._executeAuthorization(() =>
			signInWithPopup(this._afAuth, googleProvider)
		);
	}

	loginAnonymously(): Promise<UserCredential> {
		return this._executeAuthorization(() => signInAnonymously(this._afAuth));
	}

	async upgradeAnonymousAccount(): Promise<UserCredential> {
		const user = this._afAuth.currentUser;
		if (!user) throw new Error('User is not logged in.');
		if (!user.isAnonymous) throw new Error('Current account is not anonymous.');

		const googleProvider = new GoogleAuthProvider();
		const credential = await linkWithPopup(
			this._afAuth.currentUser,
			googleProvider
		);
		const { displayName, photoURL } = credential.user.providerData[0];

		await updateProfile(this._afAuth.currentUser, {
			displayName: displayName ?? '',
			photoURL: photoURL ?? '',
		});
		await updateCurrentUser(this._afAuth, credential.user);

		return credential;
	}

	async logout(): Promise<void> {
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
		handler: () => Promise<UserCredential>
	): Promise<UserCredential> {
		const credential: UserCredential = await handler();

		// Wait until user data of the newly logged in user is stored in the user$ observable (only then app can be sure that the user is logged in).
		await this._user.user$
			.pipe(
				filter(user => !!user),
				take(1)
			)
			.toPromise();

		return credential;
	}

	get isLoggedIn$() {
		return this._isLoggedIn$;
	}
}
