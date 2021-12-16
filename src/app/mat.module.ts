import { LayoutModule } from '@angular/cdk/layout';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {
	MatFormFieldDefaultOptions,
	MatFormFieldModule,
	MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

const MAT_FORM_FIELD_SETTINGS: MatFormFieldDefaultOptions = {
	appearance: 'outline',
};

@NgModule({
	declarations: [],
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
		MatRippleModule,
		PortalModule,
		MatDatepickerModule,
		MatSelectModule,
		MatNativeDateModule,
		MatRadioModule,
		MatButtonToggleModule,
		LayoutModule,
		MatGridListModule,
		MatStepperModule,
		MatTableModule,
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
