/**
 * Checks if a number is in given range.
 * @param value A number to be checked
 * @param min Lower boundary
 * @param max Upper boundary
 * @param isInclusive If it is set to true, the range is inclusive.
 * @returns Boolean value
 */

export function isBetween(
	value: number,
	min: number,
	max: number,
	isInclusive = true
): boolean {
	return isInclusive
		? value >= min && value <= max
		: value > min && value < max;
}
