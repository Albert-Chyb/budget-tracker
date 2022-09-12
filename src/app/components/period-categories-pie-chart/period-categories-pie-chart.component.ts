import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { ICategory } from '@common/interfaces/category';
import { PeriodCategories } from '@common/models/period-statistics';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
	selector: 'period-categories-pie-chart',
	templateUrl: './period-categories-pie-chart.component.html',
	styleUrls: ['./period-categories-pie-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodCategoriesPieChartComponent implements OnChanges {
	data: any[];
	readonly showLegend = true;
	readonly legendPosition = LegendPosition.Below;

	@Input() categories: ICategory[];
	@Input() categorizedStatistics: PeriodCategories;

	ngOnChanges(changes: SimpleChanges): void {
		if ('categories' in changes || 'categorizedStatistics' in changes) {
			this._setChartData(this.categorizedStatistics, this.categories);
		}
	}

	private _setChartData(stats: PeriodCategories, categories: ICategory[]) {
		this.data = Array.from(stats)
			.filter(category => category.expenses.asInteger)
			.map(categoryStatistics => ({
				name: categories.find(cat => cat.id === categoryStatistics.id).name,
				value: categoryStatistics.expenses.asDecimal,
			}));
	}
}
