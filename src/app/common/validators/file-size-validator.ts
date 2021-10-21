import { ValidatorFn } from '@angular/forms';

export function fileSizeValidator(size: number): ValidatorFn {
	return control => {
		if (control.invalid || !control.value) return null;

		const file: File = control.value;

		return file.size <= size
			? null
			: { fileTooLarge: { actualSize: file.size, maxSize: size } };
	};
}

/** Helper function that converts MB to bytes */
export const MB = (mb: number) => mb * 1024 ** 2;

/** Helper function that converts KB to bytes */
export const KB = (kb: number) => kb * 1024;
