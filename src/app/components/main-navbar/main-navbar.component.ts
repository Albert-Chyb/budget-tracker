import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnInit,
	Output,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import {
	RouteNameChange,
	RouteNameService,
} from 'src/app/services/route-name/route-name.service';
import { UserService } from 'src/app/services/user/user.service';

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
		private readonly _routeName: RouteNameService
	) {}

	@Output('onHamburgerClick') onHamburgerClick = new EventEmitter();

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
}
