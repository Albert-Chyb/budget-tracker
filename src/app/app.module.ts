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

const PolishLocaleProvider: Provider = {
	provide: LOCALE_ID,
	useValue: 'pl-PL',
};
const PolishCurrencyCodeProvider: Provider = {
	provide: DEFAULT_CURRENCY_CODE,
	useValue: 'PLN',
};

@NgModule({
	declarations: [AppComponent, MainNavbarComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatModule,
	],
	providers: [PolishLocaleProvider, PolishCurrencyCodeProvider],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor() {
		registerLocaleData(localePL, 'pl-PL');
	}
}
