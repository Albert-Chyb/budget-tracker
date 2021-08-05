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
		try {
			await this._auth.loginWithGoogle();
			this._router.navigateByUrl('/');
		} catch (error) {
			this._handleError(error);
		}
	}

	async loginAnonymously() {
		try {
			await this._auth.loginAnonymously();
			this._router.navigateByUrl('/');
		} catch (error) {
			this._handleError(error);
		}
	}

	private _handleError(error: any) {
		console.log(error);
	}
}
