import { NgModule } from '@angular/core';
import { BlackListValidatorDirective } from '@directives/black-list-validator/black-list-validator.directive';
import { FileSizeValidatorDirective } from '@directives/file-size-validator/file-size-validator.directive';
import { FileTypeValidatorDirective } from '@directives/file-type-validator/file-type-validator.directive';
import { MaxValidatorDirective } from '@directives/max-validator/max-validator.directive';
import { MinValidatorDirective } from '@directives/min-validator/min-validator.directive';

@NgModule({
	declarations: [
		MaxValidatorDirective,
		BlackListValidatorDirective,
		FileTypeValidatorDirective,
		FileSizeValidatorDirective,
		MinValidatorDirective,
	],
	exports: [
		MaxValidatorDirective,
		BlackListValidatorDirective,
		FileTypeValidatorDirective,
		FileSizeValidatorDirective,
		MinValidatorDirective,
	],
})
export class FormValidatorsModule {}
