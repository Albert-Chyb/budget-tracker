/**
 * Checks if two arrays have the same values at the same indexes.
 * It uses standard === operator to compare values
 * so be careful when working with non-primitive values.
 *
 * @param arr1 First array
 * @param arr2 Second array
 * @returns True if arrays are the same.
 */

export function compareArrays(arr1: any[], arr2: any[]): boolean {
	return arr1.every((item1, index) => item1 === arr2[index]);
}
