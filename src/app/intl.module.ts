import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';

@NgModule({
	providers: [
		{
			provide: LOCALE_ID,
			useValue: 'pl-PL',
		},
		{
			provide: DEFAULT_CURRENCY_CODE,
			useValue: 'PLN',
		},
	],
})
export class IntlModule {
	constructor() {
		registerLocaleData(localePL, 'pl-PL');
	}
}
