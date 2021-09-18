import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
} from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { isObservable, Observable } from 'rxjs';
import { finalize, takeWhile } from 'rxjs/operators';

/**
 * This component helps displaying a progress spinner when a component waits for an async task to complete.
 * It exposes simple API for showing/displaying progress spinner, and also provides a helper methods
 * that make use of Promises to automatically detect when a task is completed.
 */

@Component({
	selector: 'loading-indicator',
	templateUrl: './loading-indicator.component.html',
	styleUrls: ['./loading-indicator.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'loading-indicator',
	},
})
export class LoadingIndicatorComponent {
	constructor(private readonly _changeDetector: ChangeDetectorRef) {}

	private _isPending = false;
	mode: ProgressSpinnerMode = 'indeterminate';
	progressValue: number = 0;

	/**
	 * Shows a spinner until the received task is completed.
	 * This method is used to show the user that a component is waiting for some action to complete
	 * and progress of this task cannot be measured.
	 *
	 * @param source Can be a promise or an observable.
	 * @returns Same source as received.
	 */
	pending(source: Promise<any>): Promise<any>;
	pending(source: Promise<any>) {
		if (this.isPending)
			throw new Error('This loading indicator already awaits another task.');

		let trappedSource: Promise<any>;

		this.mode = 'indeterminate';
		this.start();

		if (source instanceof Promise) {
			trappedSource = source.finally(() => this.end());
		} else if (isObservable(source)) {
			throw new Error(
				'LoadingIndicatorComponent received an Observable where a Promise was expected. Consider converting the observable into a Promise.'
			);
		} else {
			throw new Error('LoadingIndicatorComponent only works with Promises.');
		}

		return trappedSource;
	}

	/**
	 * Shows a progress spinner that changes its progress value based on the value received from the observable.
	 * This method is used to show the user that a component is waiting for some action to complete
	 * and progress of this action can be measured (e.g. a uploading a file to the server).
	 *
	 * @param source Observable that emits a number from 0 to 100.
	 */
	progress(source: Observable<number>) {
		if (this.isPending)
			throw new Error('This loading indicator already awaits another task.');

		this.mode = 'determinate';
		this.start();

		source
			.pipe(
				takeWhile(value => value < 100, true),
				finalize(() => {
					this.end();
					this.progressValue = 0;
				})
			)
			.subscribe(value => {
				this.progressValue = value;
				this._changeDetector.detectChanges();
			});
	}

	/**
	 * Starts loading
	 */
	start() {
		this._isPending = true;
		this._changeDetector.detectChanges();
	}

	/**
	 * Stops loading
	 */
	end() {
		this._isPending = false;
		this._changeDetector.detectChanges();
	}

	/**
	 * Informs if the loading indicator currently awaits a task to be completed.
	 */
	get isPending() {
		return this._isPending;
	}
}
