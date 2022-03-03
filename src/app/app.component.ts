import { DOCUMENT } from '@angular/common';
import {
	Component,
	Inject,
	OnInit,
	Renderer2,
	RendererStyleFlags2,
} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	host: {
		class: 'with-fixed-mat-toolbar',
	},
})
export class AppComponent implements OnInit {
	constructor(
		private readonly _renderer: Renderer2,
		@Inject(DOCUMENT) private readonly _doc: Document
	) {}

	ngOnInit() {
		/*
			It is for cases, where 100vh wouldn't work.
			For example on Safari, 100vh equals the viewport when the url bar is hidden.
			However the appearing of the bar does not decrease the 100vh value.

			Javascript is not affected by this behavior, 
			and therefore exposing the viewport height by a CSS variable is the best option so far.
		*/
		this._updateViewportHeight();
		this._renderer.listen(window, 'resize', () => this._updateViewportHeight());
	}

	private _updateViewportHeight() {
		const viewportHeight = window.innerHeight;

		this._renderer.setStyle(
			this._doc.body,
			'--viewport-height',
			`${viewportHeight}px`,
			RendererStyleFlags2.DashCase
		);
	}
}
