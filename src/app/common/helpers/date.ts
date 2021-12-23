/** Returns number of days in a month. */
export function numberOfDaysInMonth(year: number, monthIndex: number): number {
	return new Date(year, monthIndex + 1, 0).getDate();
}

/** Returns the index of the first day in a month as day-of-week. */
export function firstDayInMonth(year: number, monthIndex: number): number {
	return (new Date(year, monthIndex, 1).getDay() || 7) - 1;
}

/** Returns beginning of a week based on week index in a specific month. */
export function beginningOfWeek(
	year: number,
	monthIndex: number,
	weekIndex: number
): Date {
	return new Date(
		year,
		monthIndex,
		Math.max(1, weekIndex * 7 - (firstDayInMonth(year, monthIndex) - 1))
	);
}

/** Returns ending of a week based on week index in a specific month. */
export function endingOfWeek(
	year: number,
	monthIndex: number,
	weekIndex: number
): Date {
	const day = Math.min(
		numberOfDaysInMonth(year, monthIndex),
		weekIndex * 7 - (firstDayInMonth(year, monthIndex) - 1) + 6
	);

	return new Date(year, monthIndex, day);
}

/** Adds days to the given date. */
export function addDays(date: Date, days: number): Date {
	return new Date(date.setDate(date.getDate() + days));
}
