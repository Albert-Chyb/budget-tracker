import { ErrorHandler, NgModule } from '@angular/core';
import { AuthGuardModule } from '@angular/fire/auth-guard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalErrorHandler } from '@common/errors/global-error-handler';
import { AppLayoutModule } from '@modules/app-layout.module';
import { CategoriesModule } from '@modules/categories.module';
import { DashboardModule } from '@modules/dashboard.module';
import { FirebaseModule } from '@modules/firebase.module';
import { LocalizationModule } from '@modules/localization.module';
import { PWAModule } from '@modules/pwa.module';
import { SharedModule } from '@modules/shared.module';
import { TransactionsModule } from '@modules/transactions.module';
import { WalletsModule } from '@modules/wallets.module';
import { LoginComponent } from '@pages/login/login.component';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent, LoginComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AuthGuardModule,
		LocalizationModule,
		SharedModule,
		WalletsModule,
		CategoriesModule,
		TransactionsModule,
		DashboardModule,
		AppLayoutModule,
		FirebaseModule,
		PWAModule,
	],
	providers: [
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
