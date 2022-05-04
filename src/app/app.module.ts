import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import {
	DEFAULT_CURRENCY_CODE,
	ErrorHandler,
	LOCALE_ID,
	NgModule,
	Provider,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { AuthGuardModule } from '@angular/fire/auth-guard';
import {
	connectFirestoreEmulator,
	getFirestore,
	provideFirestore,
} from '@angular/fire/firestore';
import {
	connectFunctionsEmulator,
	getFunctions,
	provideFunctions,
} from '@angular/fire/functions';
import {
	connectStorageEmulator,
	getStorage,
	provideStorage,
} from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppDateAdapter } from '@common/app-date-adapter';
import { cluesDatasets } from '@common/clues-datasets';
import { GlobalErrorHandler } from '@common/errors/global-error-handler';
import { PolishMatPaginatorIntl } from '@common/mat-paginator-intl';
import { AlertComponent } from '@components/alert/alert.component';
import { CategoriesListComponent } from '@components/categories-list/categories-list.component';
import { CategoryComponent } from '@components/category/category.component';
import { ClueComponent } from '@components/clue/clue.component';
import { FileInputComponent } from '@components/file-input/file-input.component';
import { GlobalFabComponent } from '@components/global-fab/global-fab.component';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { MainNavbarComponent } from '@components/main-navbar/main-navbar.component';
import { MainSidenavComponent } from '@components/main-sidenav/main-sidenav.component';
import { NewCategoryDialogComponent } from '@components/new-category-dialog/new-category-dialog.component';
import { NewWalletDialogComponent } from '@components/new-wallet-dialog/new-wallet-dialog.component';
import { PaginatedTransactionsTableComponent } from '@components/paginated-transactions-table/paginated-transactions-table.component';
import { PeriodPickerComponent } from '@components/period-picker/period-picker.component';
import { PromptDialogComponent } from '@components/prompt-dialog/prompt-dialog.component';
import { SidenavComponent } from '@components/sidenav/sidenav.component';
import { TransactionFormComponent } from '@components/transaction-form/transaction-form.component';
import { TransactionsTableComponent } from '@components/transactions-table/transactions-table.component';
import { WalletPickerComponent } from '@components/wallet-picker/wallet-picker.component';
import { WalletComponent } from '@components/wallet/wallet.component';
import { BlackListValidatorDirective } from '@directives/black-list-validator/black-list-validator.directive';
import {
	ClueIfDirective,
	CLUES_DATASETS,
} from '@directives/clue-if/clue-if.directive';
import { CollectionPaginatorDirective } from '@directives/collection-paginator/collection-paginator.directive';
import { CurrencyInputDirective } from '@directives/currency-input/currency-input.directive';
import { FileSizeValidatorDirective } from '@directives/file-size-validator/file-size-validator.directive';
import { FileTypeValidatorDirective } from '@directives/file-type-validator/file-type-validator.directive';
import { GlobalFabDirective } from '@directives/global-fab/global-fab.directive';
import { MaxValidatorDirective } from '@directives/max-validator/max-validator.directive';
import { MinValidatorDirective } from '@directives/min-validator/min-validator.directive';
import { SelectOnFocusDirective } from '@directives/select-on-focus/select-on-focus.directive';
import { CategoriesComponent } from '@pages/categories/categories.component';
import { CreateTransactionComponent } from '@pages/create-transaction/create-transaction.component';
import { EditTransactionComponent } from '@pages/edit-transaction/edit-transaction.component';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { TransactionsComponent } from '@pages/transactions/transactions.component';
import { WalletsComponent } from '@pages/wallets/wallets.component';
import { LoadingPipe } from '@pipes/loading/loading.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PeriodBarChartComponent } from './components/period-bar-chart/period-bar-chart.component';
import { PeriodCategoriesPieChartComponent } from './components/period-categories-pie-chart/period-categories-pie-chart.component';
import { MatModule } from './mat.module';

const PolishLocaleProvider: Provider = {
	provide: LOCALE_ID,
	useValue: 'pl-PL',
};
const PolishCurrencyCodeProvider: Provider = {
	provide: DEFAULT_CURRENCY_CODE,
	useValue: 'PLN',
};
const ErrorHandlerProvider: Provider = {
	provide: ErrorHandler,
	useClass: GlobalErrorHandler,
};
const CluesDatasetsProvider: Provider = {
	provide: CLUES_DATASETS,
	useValue: new Map(Object.entries(cluesDatasets)),
};
const AppDateAdapterProvider: Provider = {
	provide: DateAdapter,
	useClass: AppDateAdapter,
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
		WalletComponent,
		ClueComponent,
		CategoriesComponent,
		FileInputComponent,
		NewCategoryDialogComponent,
		LoadingIndicatorComponent,
		MainSidenavComponent,
		WalletPickerComponent,
		AlertComponent,
		GlobalFabComponent,
		SelectOnFocusDirective,
		ClueIfDirective,
		GlobalFabDirective,
		MaxValidatorDirective,
		BlackListValidatorDirective,
		FileTypeValidatorDirective,
		FileSizeValidatorDirective,
		LoadingPipe,
		PeriodPickerComponent,
		TransactionsTableComponent,
		TransactionsComponent,
		PaginatedTransactionsTableComponent,
		CurrencyInputDirective,
		MinValidatorDirective,
		TransactionFormComponent,
		CreateTransactionComponent,
		EditTransactionComponent,
		CollectionPaginatorDirective,
		CategoriesListComponent,
		CategoryComponent,
		PeriodBarChartComponent,
		PeriodCategoriesPieChartComponent,
	],
	imports: [
		NgxChartsModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatModule,
		FormsModule,
		AuthGuardModule,
		provideFirebaseApp(() => initializeApp(environment.firestore)),
		provideAuth(() => {
			const auth = getAuth();

			if (environment.firestoreEmulators.useEmulators) {
				const [host, port] = environment.firestoreEmulators.auth;

				connectAuthEmulator(auth, `http://${host}:${port}`);
			}

			return auth;
		}),
		provideFirestore(() => {
			const firestore = getFirestore();

			if (environment.firestoreEmulators.useEmulators) {
				const [host, port] = environment.firestoreEmulators.firestore;

				connectFirestoreEmulator(firestore, <string>host, <number>port);
			}

			return firestore;
		}),
		provideStorage(() => {
			const storage = getStorage();

			if (environment.firestoreEmulators.useEmulators) {
				const [host, port] = environment.firestoreEmulators.storage;

				connectStorageEmulator(storage, <string>host, <number>port);
			}

			return storage;
		}),
		provideFunctions(() => {
			const functions = getFunctions();

			if (environment.firestoreEmulators.useEmulators) {
				const [host, port] = environment.firestoreEmulators.functions;

				connectFunctionsEmulator(functions, <string>host, <number>port);
			}

			return functions;
		}),
	],
	providers: [
		PolishLocaleProvider,
		PolishCurrencyCodeProvider,
		ErrorHandlerProvider,
		CluesDatasetsProvider,
		AppDateAdapterProvider,
		{
			provide: MatPaginatorIntl,
			useClass: PolishMatPaginatorIntl,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor() {
		registerLocaleData(localePL, 'pl-PL');
	}
}
