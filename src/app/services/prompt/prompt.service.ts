import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptDialogComponent } from 'src/app/components/prompt-dialog/prompt-dialog.component';

export interface PromptDialogData {
	title: string;
	value: string;
	label: string;
	placeholder: string;
}

const DEFAULT_PROMPT_DIALOG_DATA: PromptDialogData = {
	title: '',
	value: '',
	label: '',
	placeholder: '',
};

@Injectable({
	providedIn: 'root',
})
export class PromptService {
	constructor(private readonly _matDialog: MatDialog) {}

	open(dialogData: Partial<PromptDialogData>) {
		const data: PromptDialogData = Object.assign(
			{ ...DEFAULT_PROMPT_DIALOG_DATA },
			dialogData
		);

		const ref = this._matDialog.open<
			PromptDialogComponent,
			PromptDialogData,
			string
		>(PromptDialogComponent, {
			data,
			width: 'clamp(300px, 70vw, 700px)',
		});

		return ref.afterClosed();
	}
}
