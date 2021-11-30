import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ICategory } from 'src/app/common/interfaces/category';
import { Chart } from 'src/app/common/models/chart';
import { TWalletCategorizedStatistics } from '../../common/interfaces/wallet-statistics';
import {
	CategorizedExpensesDataset,
	CategorizedExpensesLabelConverter,
} from './chart-utils';

@Component({
	selector: 'categorized-expenses-chart',
	templateUrl: './categorized-expenses-chart.component.html',
	styleUrls: ['./categorized-expenses-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorizedExpensesChartComponent extends Chart<TWalletCategorizedStatistics> {
	constructor() {
		super();
	}

	private _categories: ICategory[] = [];
	private _data: TWalletCategorizedStatistics = {};
	readonly chartOptions: ChartOptions = {
		maintainAspectRatio: false,
		responsive: true,
	};

	@Input('categories')
	set categories(newCategories: ICategory[]) {
		this._categories = newCategories;
		this.changeLabels(new CategorizedExpensesLabelConverter(newCategories));
	}
	get categories() {
		return this._categories;
	}

	@Input('data')
	set data(newData: TWalletCategorizedStatistics) {
		this._data = newData;
		this.changeDataset(new CategorizedExpensesDataset(newData, 'Wydatki'));
	}
	get data() {
		return this._data;
	}
}
