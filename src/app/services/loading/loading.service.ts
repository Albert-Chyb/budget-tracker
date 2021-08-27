import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
	distinctUntilChanged,
	finalize,
	first,
	map,
	switchMap,
	tap,
} from 'rxjs/operators';

type LoadingTask = Observable<any> | Promise<any>;

class LoadingIndicator {
	constructor(task: LoadingTask) {
		this._task = this._trapLoadingEnd(task);
	}

	private _task: LoadingTask;
	private readonly _onLoadingEnd = new Subject<void>();

	public readonly onLoadingEnd = this._onLoadingEnd
		.asObservable()
		.pipe(first());

	get task() {
		return this._task;
	}

	private _trapLoadingEnd(task: LoadingTask) {
		let trappedTask: LoadingTask;

		if (task instanceof Observable) {
			trappedTask = task.pipe(
				switchMap((value, index) => {
					// Only first emit should set status as loaded.
					if (index === 0) {
						return of(value).pipe(
							tap(() => {
								this._onLoadingEnd.next();
							})
						);
					} else {
						return of(value);
					}
				}),
				finalize(() => this._onLoadingEnd.next())
			);
		} else if (task instanceof Promise) {
			trappedTask = task.finally(() => this._onLoadingEnd.next());
		} else {
			throw new Error(
				'Received target cannot be used with the LoadingService.'
			);
		}

		return trappedTask;
	}
}

/**
 *
 */

@Injectable({
	providedIn: 'root',
})
export class LoadingService {
	/** Count of the currently pending tasks. */
	private readonly _count = new BehaviorSubject<number>(0);

	/** Emits whenever loading state changes. */
	public readonly isLoading$: Observable<boolean> = this._count.pipe(
		map(value => value > 0),
		distinctUntilChanged()
	);

	/**
	 * Adds a new loading task. The task can be either a Promise or an Observable.
	 * It immediately changes loading state as pending. It does not care if a Promise is actually awaited or an Observable is subscribed to.
	 * If a task never finalizes the loading state will go on forever, so make sure that the passed Promise is awaited and the Observable has a subscriber.
	 *
	 * In case of an Observable the pending stops when it emits its first value, or finalizes.
	 * The first emit is determined in the tap() operator, finalization is determined in the finalized() operator.
	 * The service never subscribes to the received observable.
	 *
	 * In case of a Promise the pending stops when it finalizes. (A callback is attached in Promise.finalize() method).
	 *
	 * @param task Promise or observable
	 * @returns Same task that was received in the parameter.
	 */
	add<T>(task: Promise<T>): Promise<T>;
	add<T>(task: Observable<T>): Observable<T>;
	add(task: LoadingTask) {
		const indicator = new LoadingIndicator(task);

		this._increaseCount();
		indicator.onLoadingEnd.subscribe(() => this._decreaseCount());

		return indicator.task;
	}

	/** Increases number of pending tasks. */
	private _increaseCount() {
		this._count.next(this._count.value + 1);
	}

	/** Decreases number of pending tasks. */
	private _decreaseCount() {
		if (this._count.value === 0) return;

		this._count.next(this._count.value - 1);
	}
}
