import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MainSidenavService } from './services/main-sidenav/main-sidenav.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	host: {
		class: 'with-fixed-mat-toolbar',
	},
})
export class AppComponent {
	constructor(public mainSidenav: MainSidenavService) {}

	log(a: any) {
		return a.pipe(tap(console.log));
	}
}
