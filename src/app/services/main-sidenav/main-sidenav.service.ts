import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MainSidenavService {
	private _matSidenav: MatSidenav;
	private _isSidenavAttached = false;
	private readonly _stateChange = new Subject();

	/** Emits whenever side nav changes its opened state. */
	isOpened$: Observable<boolean>;

	/** Emits whenever change detection should be run in the main navbar component. */
	readonly stateChange = this._stateChange.asObservable();

	open() {
		this._matSidenav?.open();
		this._stateChange.next();
	}

	close() {
		this._matSidenav?.close();
		this._stateChange.next();
	}

	toggle() {
		this._matSidenav?.toggle();
		this._stateChange.next();
	}

	/**
	 * Sets the reference to the main mat-sidenav.
	 */
	set matSidenav(sidenav: MatSidenav) {
		if (this._isSidenavAttached) {
			throw new Error('A sidenav can be attached only once.');
		}

		this.isOpened$ = sidenav.openedChange;
		this._matSidenav = sidenav;
		this._isSidenavAttached = true;
	}
}
