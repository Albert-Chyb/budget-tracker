import { Injectable } from '@angular/core';
import { Auth, authState, user } from '@angular/fire/auth';
import { IUser } from '@interfaces/user';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(private readonly _afAuth: Auth) {
		this._user$ = user(this._afAuth).pipe(
			map(user =>
				!!user
					? ({
							displayName: user.displayName,
							email: user.email,
							emailVerified: user.emailVerified,
							isAnonymous: user.isAnonymous,
							photoURL: user.photoURL,
					  } as IUser)
					: null
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

	/** Observable of the user data. */
	get user$() {
		return this._user$;
	}
}
