import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FABService {
	private readonly _onChange$ = new BehaviorSubject<TemplateRef<any> | null>(
		null
	);

	insert(template: TemplateRef<any>) {
		this._onChange$.next(template);
	}

	clear() {
		this._onChange$.next(null);
	}

	get onChange$() {
		return this._onChange$.asObservable();
	}
}
