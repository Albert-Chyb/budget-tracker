import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import {
	APP_INITIALIZER,
	DEFAULT_CURRENCY_CODE,
	ErrorHandler,
	LOCALE_ID,
	NgModule,
	Provider,
} from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import {
	AngularFireAuthModule,
	USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './common/global-error-handler';
import { initializeUser } from './common/initializers/user-auth-status';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatModule } from './mat.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { WalletsComponent } from './pages/wallets/wallets.component';
import { UserService } from './services/user/user.service';
import { NewWalletDialogComponent } from './components/new-wallet-dialog/new-wallet-dialog.component';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';
import { SelectOnFocusDirective } from './directives/select-on-focus/select-on-focus.directive';
import { WalletComponent } from './components/wallet/wallet.component';

// TODO: Add Progressive Web App

const PolishLocaleProvider: Provider = {
	provide: LOCALE_ID,
	useValue: 'pl-PL',
};
const PolishCurrencyCodeProvider: Provider = {
	provide: DEFAULT_CURRENCY_CODE,
	useValue: 'PLN',
};
const FirestoreEmulatorProvider: Provider = {
	provide: USE_FIRESTORE_EMULATOR,
	useValue: environment.firestoreEmulators.firestore,
};
const FirebaseAuthEmulatorProvider: Provider = {
	provide: USE_AUTH_EMULATOR,
	useValue: environment.firestoreEmulators.auth,
};
const ErrorHandlerProvider: Provider = {
	provide: ErrorHandler,
	useClass: GlobalErrorHandler,
};
const UserInitializerProvider: Provider = {
	provide: APP_INITIALIZER,
	useFactory: initializeUser,
	deps: [UserService],
	multi: true,
};

@NgModule({
	declarations: [
		AppComponent,
		MainNavbarComponent,
		LoginComponent,
		SidenavComponent,
		HomeComponent,
		WalletsComponent,
		NewWalletDialogComponent,
		PromptDialogComponent,
		SelectOnFocusDirective,
		WalletComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatModule,
		AngularFireModule.initializeApp(environment.firestore),
		AngularFireAuthModule,
		FormsModule,
	],
	providers: [
		PolishLocaleProvider,
		PolishCurrencyCodeProvider,
		FirebaseAuthEmulatorProvider,
		FirestoreEmulatorProvider,
		ErrorHandlerProvider,
		UserInitializerProvider,
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor() {
		registerLocaleData(localePL, 'pl-PL');
	}
}
