import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromptDialogData } from '@services/prompt/prompt.service';

@Component({
	templateUrl: './prompt-dialog.component.html',
	styleUrls: ['./prompt-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptDialogComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) private readonly _dialogData: PromptDialogData
	) {}

	value: string = this._dialogData.value;

	get title() {
		return this._dialogData.title;
	}

	get label() {
		return this._dialogData.label;
	}

	get placeholder() {
		return this._dialogData.placeholder;
	}
}
