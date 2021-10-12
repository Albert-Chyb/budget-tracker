import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

interface RouteNameChange {
	name: string;
	title: string;
	originalTitle: string;
}

@Injectable({
	providedIn: 'root',
})
export class RouteNameService extends Observable<RouteNameChange> {
	private readonly _originalTitle: string;

	constructor(
		private readonly _title: Title,
		private readonly _router: Router
	) {
		super(subscriber => {
			const subscription = this._router.events
				.pipe(filter(event => event instanceof ActivationEnd))
				.subscribe(event => {
					const { snapshot } = event as ActivationEnd;

					subscriber.next(this.changeTitle(snapshot.data.name));
				});

			subscriber.add(() => subscription.unsubscribe());
		});
		this._originalTitle = this._title.getTitle();
	}

	changeTitle(name: string) {
		const title = `${this._originalTitle} - ${name}`;
		this._title.setTitle(title);

		return {
			name,
			title,
			originalTitle: this._originalTitle,
		};
	}
}
