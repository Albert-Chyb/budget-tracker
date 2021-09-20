import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'floating-action-button',
	templateUrl: './floating-action-button.component.html',
	styleUrls: ['./floating-action-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingActionButtonComponent {}
