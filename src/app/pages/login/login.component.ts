import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
	constructor(
		private readonly _auth: AuthService,
		private readonly _router: Router,
		private readonly _loading: LoadingService
	) {}

	async loginWithGoogle() {
		await this._loading.add(this._auth.loginWithGoogle());
		this._router.navigateByUrl('/');
	}

	async loginAnonymously() {
		await this._loading.add(this._auth.loginAnonymously());
		this._router.navigateByUrl('/');
	}
}
