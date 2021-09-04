import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
	constructor(
		private readonly _auth: AuthService,
		private readonly _router: Router,
		private readonly _loading: LoadingService
	) {}

	ngOnInit(): void {}

	async loginWithGoogle() {
		this._loginUser(this._auth.loginWithGoogle());
	}

	async loginAnonymously() {
		this._loginUser(this._auth.loginAnonymously());
	}

	private async _loginUser(auth: Promise<any>) {
		const [, error] = await this._loading.add(auth);

		if (!error) {
			this._router.navigateByUrl('/');
		}
	}
}
