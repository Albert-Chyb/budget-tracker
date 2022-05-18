import { NgModule } from '@angular/core';
import { PeriodBarChartComponent } from '@components/period-bar-chart/period-bar-chart.component';
import { PeriodCategoriesPieChartComponent } from '@components/period-categories-pie-chart/period-categories-pie-chart.component';
import { PeriodChartTooltipComponent } from '@components/period-chart-tooltip/period-chart-tooltip.component';
import { PeriodPickerComponent } from '@components/period-picker/period-picker.component';
import { SharedModule } from '@modules/shared.module';
import { HomeComponent } from '@pages/home/home.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TransactionsModule } from './transactions.module';

@NgModule({
	declarations: [
		PeriodPickerComponent,
		PeriodBarChartComponent,
		PeriodChartTooltipComponent,
		PeriodCategoriesPieChartComponent,
		HomeComponent,
	],
	exports: [
		PeriodPickerComponent,
		PeriodBarChartComponent,
		PeriodChartTooltipComponent,
		PeriodCategoriesPieChartComponent,
		HomeComponent,
	],
	imports: [SharedModule, NgxChartsModule, TransactionsModule],
})
export class DashboardModule {}
