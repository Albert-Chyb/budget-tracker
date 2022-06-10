import { NgModule } from '@angular/core';
import {
	AuthGuard,
	redirectLoggedInTo,
	redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { AppTitleStrategy } from '@common/app-title-strategy';
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
} from '.././guards/default-query-parameters/default-query-parameters.guard';

const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);
const redirectLoggedOutToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'dashboard',
	},
	{
		title: 'Budżet',
		path: 'dashboard',
		component: HomeComponent,
		canActivate: [AuthGuard, DefaultQueryParametersGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
			[DEFAULT_QUERY_PARAMETERS]: {
				wallet: 'all',
				year: new Date().getFullYear(),
			},
		},
		runGuardsAndResolvers: 'paramsOrQueryParamsChange',
	},
	{
		title: 'Zaloguj się',
		path: 'login',
		component: LoginComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedInToHome,
		},
	},
	{
		title: 'Portfele',
		path: 'wallets',
		component: WalletsComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
		},
	},
	{
		title: 'Kategorie',
		path: 'categories',
		component: CategoriesComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
		},
	},
	{
		title: 'Nowa transakcja',
		path: 'transaction',
		component: CreateTransactionComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
		},
	},
	{
		title: 'Edytuj transakcje',
		path: 'transaction/:id',
		component: EditTransactionComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
		},
	},
	{
		title: 'Transakcje',
		path: 'transactions',
		component: TransactionsComponent,
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectLoggedOutToLogin,
		},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [
		{
			provide: TitleStrategy,
			useClass: AppTitleStrategy,
		},
	],
})
export class AppRoutingModule {}
