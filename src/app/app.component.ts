import { Component } from '@angular/core';
import { RouteNameService } from './services/route-name/route-name.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	host: {
		class: 'with-fixed-mat-toolbar',
	},
})
export class AppComponent {
	constructor(private readonly _routeName: RouteNameService) {}
}
