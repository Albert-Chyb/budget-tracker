export interface IComparer {
	isComparisonAvailable: boolean;
	compare(): number;
}
