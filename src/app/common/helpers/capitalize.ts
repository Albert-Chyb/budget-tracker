export function capitalize([firstLetter, ...rest]: string) {
	return firstLetter.toUpperCase() + rest.join('');
}
