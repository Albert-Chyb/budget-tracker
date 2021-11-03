type TMonthIndex =
	| '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| '11';
type TWeekIndex = '0' | '1' | '2' | '3' | '4' | '5';
type TDayIndex = '0' | '1' | '2' | '3' | '4' | '5' | '6';

/**
 * Base aggregating fields.
 */
export interface IWalletStatisticsAggregatedFields {
	expenses: number;
	income: number;
}

/**
 * Base interface for a statistic object.
 */
export interface IWalletPeriodStatistics
	extends IWalletStatisticsAggregatedFields {
	categories: TWalletCategorizedStatistics;
}

/**
 * Contains aggregated values grouped by categories.
 */
export type TWalletCategorizedStatistics = {
	[categoryID: string]: IWalletStatisticsAggregatedFields;
};

/**
 * Represents an object that contains aggregated values in a year and its months.
 * Be careful when accessing months indexes as it is not guaranteed that they all are always present.
 */
export type TWalletYearStatistics = {
	[month in TMonthIndex]: TWalletMonthStatistics;
} &
	IWalletPeriodStatistics & { walletId: string; year: number };

/**
 * Represents an object that contains aggregated values in a month and its weeks.
 * Be careful when accessing weeks indexes as it is not guaranteed that they all are always present.
 */
export type TWalletMonthStatistics = {
	[week in TWeekIndex]: TWalletWeekStatistics;
} &
	IWalletPeriodStatistics;

/**
 * Represents an object that contains aggregated values in a week and its days.
 * Be careful when accessing days indexes as it is not guaranteed that they all are always present.
 */
export type TWalletWeekStatistics = {
	[day in TDayIndex]: IWalletPeriodStatistics;
} &
	IWalletPeriodStatistics;
