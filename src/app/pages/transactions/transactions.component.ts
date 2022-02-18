import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
	ngOnInit(): void {}
}
