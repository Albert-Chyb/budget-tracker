import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnInit,
	Renderer2,
	ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'file-input',
	templateUrl: './file-input.component.html',
	styleUrls: ['./file-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: FileInputComponent,
			multi: true,
		},
	],
})
export class FileInputComponent implements ControlValueAccessor, OnInit {
	constructor(
		private readonly _renderer: Renderer2,
		private readonly _changeDetector: ChangeDetectorRef
	) {}

	@ViewChild('vanillaInput') vanillaInput: ElementRef<HTMLInputElement>;
	@ViewChild('filePreview') filePreview: ElementRef<HTMLImageElement>;
	@Input('accept') accept: string;

	private _changeValue: (newValue: File) => void;
	private _setTouchedState: () => void;
	private readonly _reader = new FileReader();
	private _initialPreview: string;
	public hasPreview = false;
	public isDisabled = false;

	/** Preview that will be displayed when there is no file selected */
	@Input('preview')
	set preview(value: string) {
		if (value && typeof value === 'string') {
			this._initialPreview = value;
			this._setPreview(value);
		}
	}
	get preview() {
		return this._initialPreview;
	}

	ngOnInit() {
		this._reader.addEventListener('loadend', $event => {
			if (typeof $event.target.result === 'string') {
				this._setPreview($event.target.result);
			}
		});
	}

	writeValue(value: any): void {
		/*
			This file input work only one way. It only reacts to the user's input. 
		*/
	}

	registerOnChange(fn: any): void {
		this._changeValue = fn;
	}

	registerOnTouched(fn: any): void {
		this._setTouchedState = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
		this._changeDetector.detectChanges();
	}

	handleFileChange() {
		const file = this.vanillaInput.nativeElement.files[0];

		// Inform Angular form that a new file was selected.
		this._changeValue(file);
		this._setTouchedState();

		if (file) {
			// In order to display the preview of a file inside the img tag, it must be converted to a string.
			if (file.type.startsWith('image/')) {
				this._reader.readAsDataURL(file);
			} else {
				this._setPreview('assets/icons/file.svg');
			}
		} else {
			// Remove preview image if no file was selected.
			this._removePreview();
		}
	}

	private _setPreview(src: string) {
		this.hasPreview = true;
		this._changeDetector.detectChanges();
		this._renderer.setAttribute(this.filePreview.nativeElement, 'src', src);
	}

	private _removePreview() {
		this.hasPreview = !!this._initialPreview;
		this._renderer.setAttribute(
			this.filePreview.nativeElement,
			'src',
			this._initialPreview ?? ''
		);
		this._changeDetector.detectChanges();
	}
}
