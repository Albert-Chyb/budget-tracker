import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { IUser } from 'src/app/common/interfaces/user';
import firebase from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(
		private readonly _afAuth: AngularFireAuth,
		private readonly _afFirestore: AngularFirestore
	) {
		this._user$ = this._afAuth.authState.pipe(
			switchMap(user =>
				user ? from(this._updateOrCreateUserData(user)) : of(null)
			),
			switchMap(user =>
				user ? this._getUserFromDatabase(user.uid) : of(null)
			),
			tap(console.log),
			shareReplay(1)
		);
	}

	private _user$: Observable<IUser | null>;

	init() {
		// TODO: Try to move first subscription in an app initializer.
		return this._user$.subscribe();
	}

	/**
	 * Updates or (if data does not exists) creates user data in the database.
	 * @param user Firebase user object
	 * @returns Promise of firebase user object
	 */
	private async _updateOrCreateUserData(
		user: firebase.User
	): Promise<firebase.User> {
		const userData: IUser = {
			displayName: user.displayName || '',
			email: user.email || '',
			emailVerified: user.emailVerified,
			isAnonymous: user.isAnonymous,
			photoURL: user.photoURL || '',
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
		};

		const userDocRef = this._afFirestore.doc<IUser>(`users/${user.uid}`);
		const userDoc = await userDocRef.ref.get();

		if (userDoc.exists) {
			// If user data exists in database, the createdAt field should not be updated.
			delete (userData as any).createdAt;

			await userDoc.ref.update(userData);
		} else {
			await userDoc.ref.set(userData);
		}

		return user;
	}

	/**
	 * Reads user data from the database. Throws error if user data does not exists.
	 * @param uid Id of an user
	 * @returns Observable of the user data
	 */
	private _getUserFromDatabase(uid: string): Observable<IUser> {
		const userRef = this._afFirestore
			.doc<IUser>(`users/${uid}`)
			.snapshotChanges();

		return userRef.pipe(
			map(user => {
				if (user.payload.exists) {
					return user.payload.data();
				} else {
					throw new Error('User data does not exists in Firestore !');
				}
			})
		);
	}

	get user$() {
		return this._user$;
	}

	get isLoggedIn$(): Observable<boolean> {
		return this._user$.pipe(map(user => !!user));
	}
}
