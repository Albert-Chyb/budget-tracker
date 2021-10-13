import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface RouteNameChange {
	name: string;
	title: string;
	originalTitle: string;
}

@Injectable({
	providedIn: 'root',
})
export class RouteNameService extends Observable<RouteNameChange> {
	private readonly _originalTitle: string;
	private readonly _changeAnnouncer = new Subject<RouteNameChange>();

	constructor(
		private readonly _title: Title,
		private readonly _router: Router
	) {
		super(subscriber => {
			const changeSub = this._changeAnnouncer.subscribe(change =>
				subscriber.next(change)
			);

			const routeSub = this._router.events
				.pipe(filter(event => event instanceof ActivationEnd))
				.subscribe(event => {
					const { snapshot } = event as ActivationEnd;

					this.changeTitle(snapshot.data.name);
				});

			subscriber.add(() => {
				changeSub.unsubscribe();
				routeSub.unsubscribe();
			});
		});
		this._originalTitle = this._title.getTitle();
	}

	changeTitle(name: string) {
		const title = `${this._originalTitle} - ${name}`;
		const change = {
			name,
			title,
			originalTitle: this._originalTitle,
		};

		this._title.setTitle(title);
		this._changeAnnouncer.next(change);

		return change;
	}
}
