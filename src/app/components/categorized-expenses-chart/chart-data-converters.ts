import { ICategory } from 'src/app/common/interfaces/category';
import { TWalletCategorizedStatistics } from 'src/app/common/interfaces/wallet-statistics';
import {
	DataConverter,
	LabelConverter,
} from 'src/app/common/models/chart-base';

export class CategorizedExpensesChartLabelConverter extends LabelConverter {
	constructor(private readonly _categories: ICategory[]) {
		super();
	}

	convert(categoryId: string): string {
		const category = this._categories.find(cat => cat.id === categoryId);

		return category?.name ?? categoryId;
	}
}

export class CategorizedExpensesChartDataConverter extends DataConverter<TWalletCategorizedStatistics> {
	convert(data: TWalletCategorizedStatistics): { [label: string]: number } {
		const convertedData = Object.entries(data).reduce(
			(dataset, [categoryId, categoryStatistics]) => {
				dataset[categoryId] = categoryStatistics.expenses;

				return dataset;
			},
			{} as any
		);

		return convertedData;
	}
}
