import {
	DEFAULT_CURRENCY_CODE,
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
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';

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
const AuthEmulatorProvider: Provider = {
	provide: USE_AUTH_EMULATOR,
	useValue: environment.firestoreEmulators.auth,
};

@NgModule({
	declarations: [AppComponent, MainNavbarComponent, LoginComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatModule,
		AngularFireModule.initializeApp(environment.firestore),
	],
	providers: [
		PolishLocaleProvider,
		PolishCurrencyCodeProvider,
		AuthEmulatorProvider,
		FirestoreEmulatorProvider,
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor() {
		registerLocaleData(localePL, 'pl-PL');
	}
}
