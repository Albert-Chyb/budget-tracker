import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
	],
})
export class MatModule {
	constructor() {}
}
