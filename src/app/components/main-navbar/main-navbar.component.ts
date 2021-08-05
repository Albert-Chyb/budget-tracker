import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
	selector: 'main-navbar',
	templateUrl: './main-navbar.component.html',
	styleUrls: ['./main-navbar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent implements OnInit {
	constructor(private readonly _auth: AuthService) {}

	isLoggedIn$ = this._auth.isLoggedIn$;

	ngOnInit(): void {}

	logout() {
		this._auth.logout();
	}

	convertAnonymousAccountToPermanent() {
		this._auth.convertAnonymousAccountToPermanent();
	}
}
