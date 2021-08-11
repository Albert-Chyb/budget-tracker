import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
	constructor(
		private readonly _auth: AuthService,
		private readonly _router: Router
	) {}

	ngOnInit(): void {}

	async loginWithGoogle() {
		const [, error] = await this._auth.loginWithGoogle();

		if (!error) {
			this._router.navigateByUrl('/');
		}
	}

	async loginAnonymously() {
		const [, error] = await this._auth.loginAnonymously();

		if (!error) {
			this._router.navigateByUrl('/');
		}
	}
}
