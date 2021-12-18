import { NgModule } from '@angular/core';
import {
	AngularFireAuthGuard,
	redirectLoggedInTo,
	redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import {
	DefaultQueryParametersGuard,
	DEFAULT_QUERY_PARAMETERS,
} from './guards/default-query-parameters/default-query-parameters.guard';
import { CategoriesComponent } from './pages/categories/categories.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { WalletsComponent } from './pages/wallets/wallets.component';

const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);
const redirectLoggedOutToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		canActivate: [AngularFireAuthGuard, DefaultQueryParametersGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Strona główna',
			[DEFAULT_QUERY_PARAMETERS]: {
				wallet: 'all',
				period: 'year',
				year: new Date().getFullYear(),
			},
		},
		runGuardsAndResolvers: 'paramsOrQueryParamsChange',
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [AngularFireAuthGuard],
		data: {
			authGuardPipe: redirectLoggedInToHome,
			name: 'Zaloguj się',
		},
	},
	{
		path: 'wallets',
		component: WalletsComponent,
		canActivate: [AngularFireAuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Portfele',
		},
	},
	{
		path: 'categories',
		component: CategoriesComponent,
		canActivate: [AngularFireAuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Kategorie',
		},
	},
	{
		path: 'transaction',
		component: TransactionComponent,
		canActivate: [AngularFireAuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Nowa transakcja',
		},
	},
	{
		path: 'transaction/:id',
		component: TransactionComponent,
		canActivate: [AngularFireAuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Edytuj transakcję',
		},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
