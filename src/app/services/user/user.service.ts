import { Injectable } from '@angular/core';
import { Auth, authState, user, User } from '@angular/fire/auth';
import {
	doc,
	docSnapshots,
	Firestore,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from '@angular/fire/firestore';
import {
	IUser,
	IUserBase,
	IUserCreatePayload,
	IUserReadPayload,
	IUserUpdatePayload,
} from '@interfaces/user';
import { from, Observable, of } from 'rxjs';
import {
	distinctUntilChanged,
	map,
	shareReplay,
	switchMap,
} from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(
		private readonly _afAuth: Auth,
		private readonly _afFirestore: Firestore
	) {
		this._user$ = user(this._afAuth).pipe(
			switchMap(user =>
				user ? from(this._updateOrCreateUserData(user)) : of(null)
			),
			switchMap(user =>
				user ? this._getUserFromDatabase(user.uid) : of(null)
			),
			shareReplay(1)
		);
	}

	private _user$: Observable<IUser | null>;
	private readonly _uid$ = authState(this._afAuth).pipe(
		map(user => user?.uid),
		distinctUntilChanged(),
		shareReplay(1)
	);

	/**
	 * Gets currently logged in user's id.
	 *
	 * @returns User id or null.
	 */
	getUid(): string | null {
		const user = this._afAuth.currentUser;

		return user?.uid;
	}

	/**
	 * Gets currently logged in user's id (rxjs way).
	 *
	 * @returns Observable of currently logged in user.
	 */
	getUid$(): Observable<string | null> {
		return this._uid$;
	}

	/**
	 * Updates or (if data does not exists) creates user data in the database.
	 * @param user Firebase user object
	 * @returns Promise of firebase user object
	 */
	private async _updateOrCreateUserData(user: User): Promise<typeof user> {
		const userData: IUserBase = {
			displayName: user.displayName || '',
			email: user.email || '',
			emailVerified: user.emailVerified,
			isAnonymous: user.isAnonymous,
			photoURL: user.photoURL || '',
		};
		const userDocRef = doc(this._afFirestore, `users/${user.uid}`);

		const userDoc = await getDoc(userDocRef);

		if (userDoc.exists()) {
			const updatePayload: IUserUpdatePayload = userData;

			await updateDoc(userDocRef, updatePayload);
		} else {
			const createPayload: IUserCreatePayload = {
				...userData,
				createdAt: serverTimestamp(),
			};

			await setDoc(userDocRef, createPayload);
		}

		return user;
	}

	/**
	 * Reads user data from the database. Throws error if user data does not exists.
	 * @param uid Id of an user
	 * @returns Observable of the user data
	 */
	private _getUserFromDatabase(uid: string): Observable<IUser> {
		return docSnapshots(doc(this._afFirestore, `users/${uid}`)).pipe(
			map(user => {
				if (user.exists()) {
					const data = user.data() as IUserReadPayload;

					return {
						...data,
						uid,
						createdAt: data.createdAt.toDate(),
					};
				} else {
					throw new Error('User data does not exists in Firestore !');
				}
			})
		);
	}

	/** Observable of the user data. */
	get user$() {
		return this._user$;
	}

	/** Observable of the user's auth state. */
	get isLoggedIn$(): Observable<boolean> {
		return this._user$.pipe(map(user => !!user));
	}
}
