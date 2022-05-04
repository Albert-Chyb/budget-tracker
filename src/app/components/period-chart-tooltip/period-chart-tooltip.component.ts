import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface ITooltipContext {
	series: string;
	name: string;
	value: string;
}

@Component({
	selector: 'period-chart-tooltip',
	templateUrl: './period-chart-tooltip.component.html',
	styleUrls: ['./period-chart-tooltip.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodChartTooltipComponent {
	@Input() model: ITooltipContext;
}
