import { NgModule } from '@angular/core';
import {
	AuthGuard,
	redirectLoggedInTo,
	redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from '@pages/categories/categories.component';
import { CreateTransactionComponent } from '@pages/create-transaction/create-transaction.component';
import { EditTransactionComponent } from '@pages/edit-transaction/edit-transaction.component';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { TransactionsComponent } from '@pages/transactions/transactions.component';
import { WalletsComponent } from '@pages/wallets/wallets.component';
import {
	DefaultQueryParametersGuard,
	DEFAULT_QUERY_PARAMETERS,
} from './guards/default-query-parameters/default-query-parameters.guard';

const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);
const redirectLoggedOutToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'dashboard',
	},
	{
		path: 'dashboard',
		component: HomeComponent,
		canActivate: [AuthGuard, DefaultQueryParametersGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Strona główna',
			[DEFAULT_QUERY_PARAMETERS]: {
				wallet: 'all',
				periodName: 'year',
				year: new Date().getFullYear(),
			},
		},
		runGuardsAndResolvers: 'paramsOrQueryParamsChange',
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedInToHome,
			name: 'Zaloguj się',
		},
	},
	{
		path: 'wallets',
		component: WalletsComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Portfele',
		},
	},
	{
		path: 'categories',
		component: CategoriesComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Kategorie',
		},
	},
	{
		path: 'transaction',
		component: CreateTransactionComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Nowa transakcja',
		},
	},
	{
		path: 'transaction/:id',
		component: EditTransactionComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Edytuj transakcję',
		},
	},
	{
		path: 'transactions',
		component: TransactionsComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			name: 'Transakcje',
		},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
