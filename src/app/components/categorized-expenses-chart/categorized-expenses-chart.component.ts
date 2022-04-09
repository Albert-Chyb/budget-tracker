import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import { ICategory } from '@interfaces/category';
import { PieChart } from '@models/chart-base';
import { WalletCategorizedStatistics } from '@models/wallet-statistics';
import { ChartOptions } from 'chart.js';
import {
	CategorizedExpensesChartDataConverter,
	CategorizedExpensesChartLabelConverter,
} from './chart-data-converters';

@Component({
	selector: 'categorized-expenses-chart',
	templateUrl: './categorized-expenses-chart.component.html',
	styleUrls: ['./categorized-expenses-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorizedExpensesChartComponent
	extends PieChart<WalletCategorizedStatistics>
	implements OnInit
{
	readonly chartOptions: ChartOptions = {
		maintainAspectRatio: false,
		responsive: true,
	};

	private _categories: ICategory[];
	@Input('categories')
	public set categories(value: ICategory[]) {
		this._categories = value;
		this.setLabelConverter(
			new CategorizedExpensesChartLabelConverter(this.categories)
		);
	}
	public get categories(): ICategory[] {
		return this._categories;
	}

	ngOnInit() {
		this.addDataConverter(new CategorizedExpensesChartDataConverter('Wydatki'));
	}
}
