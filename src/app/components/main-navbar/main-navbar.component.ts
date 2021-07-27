import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'main-navbar',
	templateUrl: './main-navbar.component.html',
	styleUrls: ['./main-navbar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
