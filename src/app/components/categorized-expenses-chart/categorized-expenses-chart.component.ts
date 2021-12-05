import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ICategory } from 'src/app/common/interfaces/category';
import { PieChart } from 'src/app/common/models/chart-base';
import { TWalletCategorizedStatistics } from '../../common/interfaces/wallet-statistics';
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
	extends PieChart<TWalletCategorizedStatistics>
	implements OnInit
{
	readonly chartOptions: ChartOptions = {
		maintainAspectRatio: false,
		responsive: true,
	};

	@Input('categories') categories: ICategory[];

	ngOnInit() {
		this.setLabelConverter(
			new CategorizedExpensesChartLabelConverter(this.categories)
		);
		this.addDataConverter(new CategorizedExpensesChartDataConverter('Wydatki'));
	}
}
