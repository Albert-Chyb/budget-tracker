import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
	selector: 'sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit {
	constructor(private readonly _user: UserService) {}

	currentlyActivatedRouteIndex: number;

	sidenavItems = [
		{
			icon: 'home',
			text: 'Strona główna',
			routerLink: '/',
		},
		{
			icon: 'add_circle',
			text: 'Dodaj transakcje',
			routerLink: '/transaction',
		},
		{
			icon: 'analytics',
			text: 'Statystyki',
			routerLink: '/analytics',
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

	ngOnInit(): void {}
}
