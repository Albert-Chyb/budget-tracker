import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Output,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
	selector: 'sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
	constructor(
		private readonly _user: UserService,
		private readonly _auth: AuthService,
		private readonly _loading: LoadingService
	) {}

	@Output('onItemClick') onItemClick = new EventEmitter<void>();

	sidenavItems = [
		{
			icon: 'home',
			text: 'Strona główna',
			routerLink: '/',
		},
		{
			icon: 'receipt_long',
			text: 'Transakcje',
			routerLink: '/transactions',
		},
		{
			icon: 'add_circle',
			text: 'Dodaj transakcje',
			routerLink: '/transaction',
		},
		{
			icon: 'account_balance_wallet',
			text: 'Portfele',
			routerLink: '/wallets',
		},
		{
			icon: 'category',
			text: 'Kategorie',
			routerLink: '/categories',
		},
	];

	user$ = this._user.user$;

	upgradeAccount() {
		return this._loading.add(this._auth.upgradeAnonymousAccount());
	}
}
