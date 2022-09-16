import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cluesDatasets } from '@common/clues-datasets';
import { AlertComponent } from '@components/alert/alert.component';
import { AmountDialogComponent } from '@components/amount-dialog/amount-dialog.component';
import { FileInputComponent } from '@components/file-input/file-input.component';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { PromptDialogComponent } from '@components/prompt-dialog/prompt-dialog.component';
import { CollectionPaginatorDirective } from '@directives/collection-paginator/collection-paginator.directive';
import { CurrencyInputDirective } from '@directives/currency-input/currency-input.directive';
import { GlobalFabDirective } from '@directives/global-fab/global-fab.directive';
import { SelectOnFocusDirective } from '@directives/select-on-focus/select-on-focus.directive';
import { AppRoutingModule } from '@modules/app-routing.module';
import { MatModule } from '@modules/mat.module';
import { LoadingPipe } from '@pipes/loading/loading.pipe';
import { FormControlValidatorDirective } from '../directives/form-control-validator/form-control-validator.directive';
import { PercentageChangePipe } from '../pipes/percentage-change/percentage-change.pipe';
import { ActionsModule } from './actions.module';
import { CluesModule } from './clues.module';
import { FormValidatorsModule } from './form-validators.module';

@NgModule({
	declarations: [
		PromptDialogComponent,
		AlertComponent,
		LoadingPipe,
		FileInputComponent,
		LoadingIndicatorComponent,
		SelectOnFocusDirective,
		GlobalFabDirective,
		CurrencyInputDirective,
		CollectionPaginatorDirective,
		PercentageChangePipe,
		AmountDialogComponent,
		FormControlValidatorDirective,
	],
	exports: [
		PromptDialogComponent,
		FileInputComponent,
		LoadingIndicatorComponent,
		AlertComponent,
		SelectOnFocusDirective,
		GlobalFabDirective,
		LoadingPipe,
		CurrencyInputDirective,
		CollectionPaginatorDirective,
		CommonModule,
		MatModule,
		FormsModule,
		AppRoutingModule,
		CluesModule,
		FormValidatorsModule,
		ActionsModule,
		PercentageChangePipe,
		AmountDialogComponent,
		FormControlValidatorDirective,
	],
	imports: [
		FormValidatorsModule,
		CommonModule,
		MatModule,
		FormsModule,
		AppRoutingModule,
		CluesModule.datasets(new Map(Object.entries(cluesDatasets))),
		ActionsModule,
	],
})
export class SharedModule {}
