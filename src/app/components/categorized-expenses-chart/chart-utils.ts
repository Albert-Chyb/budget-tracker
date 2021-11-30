import { capitalize } from 'src/app/common/helpers/capitalize';
import { ICategory } from 'src/app/common/interfaces/category';
import { ChartDataset, ChartLabelConverter } from 'src/app/common/models/chart';
import { TWalletCategorizedStatistics } from '../../common/interfaces/wallet-statistics';

export class CategorizedExpensesDataset extends ChartDataset<TWalletCategorizedStatistics> {
	public readonly length: number = this._calculateLength();
	private readonly _valuesOfData = Object.values(this.data);

	getDataAt(index: number): number {
		return this._valuesOfData[index].expenses;
	}

	private _calculateLength(): number {
		return Object.keys(this.data).length;
	}
}

export class CategorizedExpensesLabelConverter extends ChartLabelConverter<TWalletCategorizedStatistics> {
	constructor(private readonly _categories: ICategory[]) {
		super();
	}

	convert(index: number, data: TWalletCategorizedStatistics): string {
		const categoryId = Object.keys(data)[index];
		const matchingCategory = this._categories.find(
			cat => cat.id === categoryId
		);

		return capitalize(matchingCategory.name);
	}
}
