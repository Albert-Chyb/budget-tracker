import { NgModule } from '@angular/core';
import { BlackListValidatorDirective } from '@directives/black-list-validator/black-list-validator.directive';
import { FileSizeValidatorDirective } from '@directives/file-size-validator/file-size-validator.directive';
import { FileTypeValidatorDirective } from '@directives/file-type-validator/file-type-validator.directive';

@NgModule({
	declarations: [
		BlackListValidatorDirective,
		FileTypeValidatorDirective,
		FileSizeValidatorDirective,
	],
	exports: [
		BlackListValidatorDirective,
		FileTypeValidatorDirective,
		FileSizeValidatorDirective,
	],
})
export class FormValidatorsModule {}
