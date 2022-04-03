import { Injectable } from '@angular/core';
import { BehaviorSubject, isObservable, Observable } from 'rxjs';
import {
	distinctUntilChanged,
	finalize,
	map,
	shareReplay,
	switchMapTo,
	take,
} from 'rxjs/operators';

type LoadingTask = Observable<any> | Promise<any>;

@Injectable({
	providedIn: 'root',
})
export class LoadingService {
	/** Count of the currently pending tasks. */
	private readonly _count$ = new BehaviorSubject<number>(0);

	/** Emits whenever loading state changes. */
	public readonly isLoading$: Observable<boolean> = this._count$.pipe(
		map(value => value > 0),
		distinctUntilChanged()
	);

	/**
	 * Adds an async task.
	 *
	 * @param task A promise or an observable.
	 * @returns Same task as received.
	 */
	add<T>(task: Promise<T>): Promise<T>;
	add<T>(task: Observable<T>): Observable<T>;
	add(task: LoadingTask) {
		/** Task with attached callbacks. */
		let trapped: Observable<any> | Promise<any>;

		this._increaseCount();

		if (isObservable(task)) {
			const original$ = task.pipe(shareReplay(1));

			trapped = original$.pipe(
				take(1),
				finalize(() => this._decreaseCount()),
				switchMapTo(original$)
			);
		} else {
			const original = Promise.resolve(task);

			trapped = original.finally(() => this._decreaseCount());
		}

		return trapped;
	}

	/** Increases number of pending tasks. */
	private _increaseCount() {
		this._count$.next(this._count$.value + 1);
	}

	/** Decreases number of pending tasks. */
	private _decreaseCount() {
		if (this._count$.value === 0) return;

		this._count$.next(this._count$.value - 1);
	}
}
