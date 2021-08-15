import { NgModule } from '@angular/core';
import {
	AngularFireAuthGuard,
	redirectLoggedInTo,
	redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { LoginComponent } from './pages/login/login.component';

const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);
const redirectLoggedOutToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		canActivate: [AngularFireAuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
		},
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [AngularFireAuthGuard],
		data: {
			authGuardPipe: redirectLoggedInToHome,
		},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
