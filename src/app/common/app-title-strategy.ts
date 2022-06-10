import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { isNullish } from './helpers/isNullish';

@Injectable({
	providedIn: 'root',
})
export class AppTitleStrategy extends TitleStrategy {
	constructor(private readonly _title: Title) {
		super();
	}

	override updateTitle(snapshot: RouterStateSnapshot): void {
		const title = this.buildTitle(snapshot);

		if (!isNullish(title)) {
			this._title.setTitle(`Monitor Budżetu - ${title}`);
		} else {
			this._title.setTitle('Monitor Budżetu');
		}
	}
}
