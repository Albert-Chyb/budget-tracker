import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Output,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user/user.service';

interface ISidenavItem {
	icon: string;
	text: string;
	routerLink: string;
	linkOptions: RouterLinkActive['routerLinkActiveOptions'];
}

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

	private readonly _defaultLinkOptions: RouterLinkActive['routerLinkActiveOptions'] =
		{
			exact: true,
		};

	sidenavItems: ISidenavItem[] = [
		{
			icon: 'home',
			text: 'Strona główna',
			routerLink: '/dashboard',
			linkOptions: {
				exact: false,
			},
		},
		{
			icon: 'receipt_long',
			text: 'Transakcje',
			routerLink: '/transactions',
			linkOptions: this._defaultLinkOptions,
		},
		{
			icon: 'add_circle',
			text: 'Dodaj transakcje',
			routerLink: '/transaction',
			linkOptions: this._defaultLinkOptions,
		},
		{
			icon: 'account_balance_wallet',
			text: 'Portfele',
			routerLink: '/wallets',
			linkOptions: this._defaultLinkOptions,
		},
		{
			icon: 'category',
			text: 'Kategorie',
			routerLink: '/categories',
			linkOptions: this._defaultLinkOptions,
		},
	];

	user$ = this._user.user$;

	upgradeAccount() {
		return this._loading.add(this._auth.upgradeAnonymousAccount());
	}
}
