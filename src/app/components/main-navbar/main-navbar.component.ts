import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Output,
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
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
		private readonly _user: UserService,
		private readonly _loading: LoadingService
	) {}

	@Output('onHamburgerClick') onHamburgerClick = new EventEmitter();

	isLoggedIn$ = this._user.isLoggedIn$;
	shouldDisplayLoader$ = this._loading.isLoading$.pipe(debounceTime(50));

	logout() {
		this._auth.logout();
	}
}
