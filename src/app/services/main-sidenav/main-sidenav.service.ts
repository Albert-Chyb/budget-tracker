import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { merge, Observable, Subject } from 'rxjs';
import { mapTo, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class MainSidenavService {
	private _matSidenav: MatSidenav;
	private _isSidenavAttached = false;

	private readonly _onAttach$ = new Subject<MatSidenav>();
	private readonly _onStateChange$ = new Subject();

	/** Emits whenever side nav changes its opened state. */
	readonly isOpened$: Observable<boolean> = this._onAttach$.pipe(
		tap(() => (this._isSidenavAttached = true)),
		tap(sidenav => (this._matSidenav = sidenav)),
		switchMap(sidenav =>
			merge(
				sidenav.openedStart.pipe(mapTo(true)),
				sidenav.closedStart.pipe(mapTo(false))
			)
		),
		startWith(false),
		shareReplay(1)
	);

	/** Emits whenever change detection should be run in the main navbar component. */
	readonly stateChange$ = this._onStateChange$.asObservable();

	open() {
		this._matSidenav?.open();
		this._onStateChange$.next();
	}

	close() {
		this._matSidenav?.close();
		this._onStateChange$.next();
	}

	toggle() {
		this._matSidenav?.toggle();
		this._onStateChange$.next();
	}

	/**
	 * Sets the reference to the main mat-sidenav.
	 */
	set matSidenav(sidenav: MatSidenav) {
		if (this._isSidenavAttached) {
			throw new Error('A sidenav can be attached only once.');
		}

		this._onAttach$.next(sidenav);
	}
}
