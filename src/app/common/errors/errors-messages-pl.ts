import { ErrorCode } from './error-code';

/**
 * Contains messages associated with error codes.
 */
const errorMessages = new Map<string, string>([
	['default', 'Wystąpił nieoczekiwany błąd.'],
	[ErrorCode.TransactionNotFound, 'Transakcja nie została znaleziona.'],
	[
		ErrorCode.WalletReferenced,
		'Nie można wykonać operacji, ponieważ w portfelu znajdują się transakcje.',
	],
	[
		ErrorCode.CategoryReferenced,
		'Nie można wykonać operacji, ponieważ istnieje transakcja z tą kategorią.',
	],

	// Firebase auth errors.
	['auth/credential-already-in-use', 'Wybrane konto istnieje już w serwisie.'],
	[
		'auth/cancelled-popup-request',
		'Tylko jedno okno logowania może być otwarte w tym samym czasie.',
	],
	[
		'auth/operation-not-supported-in-this-environment',
		'Logowanie może odbyć się tylko poprzez protoków http lub https.',
	],
	[
		'auth/popup-blocked',
		'Okno logowania zostało zablokowane przez przeglądarkę. Sprawdź ustawienia okien Popup dla tej strony.',
	],
	[
		'auth/popup-closed-by-user',
		'Okno logowania zostało zamknięte za wcześnie.',
	],
]);

export const DEFAULT_ERROR_CODE = 'default';

export const getErrorMessage = (code: string): string => {
	code = errorMessages.has(code) ? code : DEFAULT_ERROR_CODE;

	if (code === DEFAULT_ERROR_CODE && !errorMessages.has(DEFAULT_ERROR_CODE)) {
		throw new Error('The default error message was not set.');
	}

	return errorMessages.get(code);
};
