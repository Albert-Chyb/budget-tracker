import {
	APP_INITIALIZER,
	DEFAULT_CURRENCY_CODE,
	ErrorHandler,
	LOCALE_ID,
	NgModule,
	Provider,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatModule } from './mat.module';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { LoginComponent } from './pages/login/login.component';
import {
	AngularFireAuthModule,
	USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { GlobalErrorHandler } from './common/global-error-handler';
import { initializeUser } from './common/initializers/user-auth-status';
import { UserService } from './services/user/user.service';
import { SidenavComponent } from './components/sidenav/sidenav.component';

// TODO: 1. Add Progressive Web App
// TODO: 2. Create service for authentication
// TODO: 3. Create service for managing currently logged in user.

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
	declarations: [AppComponent, MainNavbarComponent, LoginComponent, SidenavComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatModule,
		AngularFireModule.initializeApp(environment.firestore),
		AngularFireAuthModule,
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
