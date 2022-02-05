import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ICategory } from 'src/app/common/interfaces/category';
import { PieChart } from 'src/app/common/models/chart-base';
import { WalletCategorizedStatistics } from 'src/app/common/models/wallet-statistics';
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
