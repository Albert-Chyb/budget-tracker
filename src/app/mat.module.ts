import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import {
	MatFormFieldDefaultOptions,
	MatFormFieldModule,
	MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';

const MAT_FORM_FIELD_SETTINGS: MatFormFieldDefaultOptions = {
	appearance: 'outline',
};

@NgModule({
	declarations: [],
	imports: [CommonModule],
	exports: [
		MatToolbarModule,
		MatButtonModule,
		MatCardModule,
		MatDividerModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatSidenavModule,
		MatListModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatMenuModule,
	],
	providers: [
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: MAT_FORM_FIELD_SETTINGS,
		},
	],
})
export class MatModule {
	constructor() {}
}
