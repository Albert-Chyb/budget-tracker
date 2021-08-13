import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
	selector: 'main-navbar',
	templateUrl: './main-navbar.component.html',
	styleUrls: ['./main-navbar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent {
	constructor(
		private readonly _auth: AuthService,
		private readonly _user: UserService
	) {}

	isLoggedIn$ = this._user.isLoggedIn$;

	logout() {
		this._auth.logout();
	}

	convertAnonymousAccountToPermanent() {
		this._auth.convertAnonymousAccountToPermanent();
	}
}
