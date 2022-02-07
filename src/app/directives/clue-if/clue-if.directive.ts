import {
	Directive,
	Inject,
	InjectionToken,
	Input,
	Renderer2,
	Self,
	TemplateRef,
	Type,
	ViewContainerRef,
} from '@angular/core';
import { ClueComponent } from 'src/app/components/clue/clue.component';

export type TCluesDatasets = Map<string, IClueData>;

export interface IClueData {
	/** Message that will be displayed under the image. */
	message: string;

	/** Image source that will be placed inside of the img element. */
	img: string;
}

/**
 * Use this injection token to provide a default clue name.
 * By default it provides '**' wildcard.
 */
export const DEFAULT_CLUE_NAME = new InjectionToken<string>(
	'DEFAULT_CLUE_NAME',
	{
		factory: () => '**',
	}
);

/**
 * Use this injection token to provide necessary datasets for your app.
 * By default it provides an empty Map object.
 */
export const CLUES_DATASETS = new InjectionToken<TCluesDatasets>(
	'CLUES_DATASETS',
	{
		factory: () => new Map(),
	}
);

@Directive({
	selector: '[clueIf]',
})
export class ClueIfDirective {
	constructor(
		@Self() private readonly _viewContainer: ViewContainerRef,
		@Self() private readonly _templateRef: TemplateRef<any>,
		private readonly _renderer: Renderer2,

		@Inject(CLUES_DATASETS)
		private readonly _cluesDatasets: TCluesDatasets,

		@Inject(DEFAULT_CLUE_NAME)
		private readonly _defaultClueName: string
	) {}

	private _isClueShown: boolean;

	@Input('clueIfUse') clueName: string;

	@Input('clueIf')
	set clueIf(showClue: boolean) {
		if (this._isClueShown === showClue) return;

		this._isClueShown = showClue;
		this._viewContainer.clear();

		if (showClue) {
			const { img, message } = this._getClueData(
				this.clueName ?? this._defaultClueName
			);

			this._insertClueIntoView(ClueComponent, message, img);
		} else {
			this._viewContainer.createEmbeddedView(this._templateRef);
		}
	}
	get clueIf() {
		return this._isClueShown;
	}

	private _insertClueIntoView(Component: Type<any>, msg: string, img: string) {
		const componentRef = this._viewContainer.createComponent(Component, {
			projectableNodes: this._crateProjectionTextNode(msg),
		});

		componentRef.instance.img = img;

		return componentRef;
	}

	private _crateProjectionTextNode(text: string): any[][] {
		return [[this._renderer.createText(text)]];
	}

	private _getClueData(name: string): IClueData {
		if (this._cluesDatasets.has(name)) {
			return this._cluesDatasets.get(name);
		} else if ((name = '**')) {
			throw new Error(
				`The default clue was not created. Use the '**' wildcard as a name to create it.`
			);
		} else {
			throw new Error(
				`Could not find a clue with name: "${name}". Please register this clue using injection token`
			);
		}
	}
}
