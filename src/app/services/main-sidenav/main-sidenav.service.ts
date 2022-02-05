import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MainSidenavService {
	private readonly _isOpened$ = new BehaviorSubject(false);
	readonly isOpened$ = this._isOpened$.asObservable();

	open() {
		this._isOpened$.next(true);
	}

	close() {
		this._isOpened$.next(false);
	}

	toggle() {
		this._isOpened$.next(!this._isOpened$.value);
	}
}
