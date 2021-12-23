import { ICategory } from 'src/app/common/interfaces/category';
import {
	DataConverter,
	LabelConverter,
	TChartData,
} from 'src/app/common/models/chart-base';
import { WalletCategorizedStatistics } from 'src/app/common/models/wallet-statistics';

export class CategorizedExpensesChartLabelConverter extends LabelConverter {
	constructor(private readonly _categories: ICategory[]) {
		super();
	}

	convert(categoryId: string): string {
		const category = this._categories.find(cat => cat.id === categoryId);

		return category?.name ?? categoryId;
	}
}

export class CategorizedExpensesChartDataConverter extends DataConverter<WalletCategorizedStatistics> {
	convert(data: WalletCategorizedStatistics): TChartData {
		return Array.from(data)
			.filter(category => category.expenses > 0)
			.reduce<TChartData>((chartData, category) => {
				chartData[category.id] = category.expenses;

				return chartData;
			}, {});
	}
}
