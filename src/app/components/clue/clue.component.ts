import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'clue',
	templateUrl: './clue.component.html',
	styleUrls: ['./clue.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClueComponent {
	constructor() {}

	@Input('img') img: string;
}
