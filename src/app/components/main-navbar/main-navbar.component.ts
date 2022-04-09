import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { MainSidenavService } from '@services/main-sidenav/main-sidenav.service';
import {
	RouteNameChange,
	RouteNameService,
} from '@services/route-name/route-name.service';
import { UserService } from '@services/user/user.service';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
	selector: 'main-navbar',
	templateUrl: './main-navbar.component.html',
	styleUrls: ['./main-navbar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent implements OnInit {
	constructor(
		private readonly _auth: AuthService,
		private readonly _user: UserService,
		private readonly _loading: LoadingService,
		private readonly _routeName: RouteNameService,
		private readonly _sidenav: MainSidenavService
	) {}

	isLoggedIn$ = this._user.isLoggedIn$;
	shouldDisplayLoader$ = this._loading.isLoading$.pipe(debounceTime(50));

	data$: Observable<{
		routeNameChange: RouteNameChange;
		isLoggedIn: boolean;
		shouldDisplayLoader: boolean;
	}>;

	ngOnInit() {
		this.data$ = combineLatest([
			this._auth.isLoggedIn$,
			this._loading.isLoading$,
			this._routeName,
		]).pipe(
			map(([isLoggedIn, isLoading, routeNameChange]) => ({
				isLoggedIn,
				shouldDisplayLoader: isLoading,
				routeNameChange,
			}))
		);
	}

	logout() {
		this._auth.logout();
	}

	toggleSidenav() {
		this._sidenav.toggle();
	}
}
