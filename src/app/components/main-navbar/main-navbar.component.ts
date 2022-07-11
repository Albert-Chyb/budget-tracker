import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { MainSidenavService } from '@services/main-sidenav/main-sidenav.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Number of milliseconds to wait until the loading indicator is shown.
 * This will prevent the indicator to show up during quick actions,
 * that may not need indicating the loading state.
 */
const LOADER_DELAY: number = 150;

@Component({
	selector: 'main-navbar',
	templateUrl: './main-navbar.component.html',
	styleUrls: ['./main-navbar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent {
	constructor(
		private readonly _auth: AuthService,
		private readonly _loading: LoadingService,
		private readonly _sidenav: MainSidenavService
	) {}

	readonly isLoggedIn$ = this._auth.isLoggedIn$;
	readonly shouldDisplayLoader$ = this._loading.isLoading$.pipe(
		debounceTime(LOADER_DELAY),
		distinctUntilChanged()
	);

	logout() {
		this._auth.logout();
	}

	toggleSidenav() {
		this._sidenav.toggle();
	}
}
