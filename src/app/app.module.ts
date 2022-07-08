import { ErrorHandler, NgModule } from '@angular/core';
import { AuthGuardModule } from '@angular/fire/auth-guard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GlobalErrorHandler } from '@common/errors/global-error-handler';
import { AppLayoutModule } from '@modules/app-layout.module';
import { CategoriesModule } from '@modules/categories.module';
import { DashboardModule } from '@modules/dashboard.module';
import { FirebaseModule } from '@modules/firebase.module';
import { LocalizationModule } from '@modules/localization.module';
import { SharedModule } from '@modules/shared.module';
import { TransactionsModule } from '@modules/transactions.module';
import { WalletsModule } from '@modules/wallets.module';
import { LoginComponent } from '@pages/login/login.component';
import { environment } from '../environments/environment';
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
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000',
		}),
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
