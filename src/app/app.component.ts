import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	host: {
		class: 'with-fixed-mat-toolbar',
	},
})
export class AppComponent {
	constructor(private readonly _user: UserService) {
		this._user.init();
	}
}
