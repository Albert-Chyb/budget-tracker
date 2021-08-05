import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private readonly _afAuth: AngularFireAuth) {
		this._isLoggedIn$ = this._afAuth.user.pipe(map(user => !!user));
	}

	private _isLoggedIn$: Observable<boolean>;

	async loginWithGoogle() {
		const googleProvider = new firebase.auth.GoogleAuthProvider();

		return this._afAuth.signInWithPopup(googleProvider);
	}

	loginAnonymously() {
		return this._afAuth.signInAnonymously();
	}

	async convertAnonymousAccountToPermanent() {
		const user = await this._afAuth.currentUser;
		if (!user) throw new Error('User is not logged in !');
		if (!user.isAnonymous) throw new Error('User`s account is not anonymous !');

		const googleProvider = new firebase.auth.GoogleAuthProvider();

		return await user.linkWithPopup(googleProvider);
	}

	logout() {
		this._afAuth.signOut();
	}

	get isLoggedIn$() {
		return this._isLoggedIn$;
	}
}
