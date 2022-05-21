import { isNullish } from '@common/helpers/isNullish';
import { IComparer } from '@common/interfaces/comparer';

export class PercentageChangeComparison implements IComparer {
	constructor(
		public previousValue: number | null,
		public currentValue: number | null
	) {}

	get isComparisonAvailable(): boolean {
		return !isNullish(this.previousValue) && !isNullish(this.currentValue);
	}

	compare(): number {
		if (!this.isComparisonAvailable) {
			return null;
		}

		const delta = this.currentValue - this.previousValue;

		return this.previousValue === 0 ? 0 : delta / this.previousValue;
	}
}
