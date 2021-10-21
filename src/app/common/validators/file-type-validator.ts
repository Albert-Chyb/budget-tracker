import { ValidatorFn } from '@angular/forms';

export function fileTypeValidator(allowed: string[]): ValidatorFn {
	return control => {
		if (control.invalid || !control.value) return null;

		const file: File = control.value;

		return allowed.includes(file.type)
			? null
			: { invalidFileType: { presentType: file.type, requiredTypes: allowed } };
	};
}
