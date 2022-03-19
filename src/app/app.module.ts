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
import { AngularFireModule } from '@angular/fire/compat';
import {
	AngularFireAuthModule,
	USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
import {
	AngularFireFunctionsModule,
	REGION,
	USE_EMULATOR as USE_CLOUD_FUNCTIONS_EMULATOR,
} from '@angular/fire/compat/functions';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import firebase from 'firebase/compat/app';
import { NgChartsModule } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppDateAdapter } from './common/app-date-adapter';
import { cluesDatasets } from './common/clues-datasets';
import { GlobalErrorHandler } from './common/global-error-handler';
import { initializeUser } from './common/initializers/user-auth-status';
import { PolishMatPaginatorIntl } from './common/mat-paginator-intl';
import { AlertComponent } from './components/alert/alert.component';
import { CategorizedExpensesChartComponent } from './components/categorized-expenses-chart/categorized-expenses-chart.component';
import { ClueComponent } from './components/clue/clue.component';
import { FileInputComponent } from './components/file-input/file-input.component';
import { GlobalFabComponent } from './components/global-fab/global-fab.component';
import { GroupedTransactionsChartComponent } from './components/grouped-transactions-chart/grouped-transactions-chart.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { MainSidenavComponent } from './components/main-sidenav/main-sidenav.component';
import { NewCategoryDialogComponent } from './components/new-category-dialog/new-category-dialog.component';
import { NewWalletDialogComponent } from './components/new-wallet-dialog/new-wallet-dialog.component';
import { PaginatedFirestoreCollectionTableComponent } from './components/paginated-firestore-collection-table/paginated-firestore-collection-table.component';
import { PaginatedTransactionsTableComponent } from './components/paginated-transactions-table/paginated-transactions-table.component';
import { PeriodPickerComponent } from './components/period-picker/period-picker.component';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { WalletPickerComponent } from './components/wallet-picker/wallet-picker.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { BlackListValidatorDirective } from './directives/black-list-validator/black-list-validator.directive';
import {
	ClueIfDirective,
	CLUES_DATASETS,
} from './directives/clue-if/clue-if.directive';
import { CurrencyInputDirective } from './directives/currency-input/currency-input.directive';
import { FileSizeValidatorDirective } from './directives/file-size-validator/file-size-validator.directive';
import { FileTypeValidatorDirective } from './directives/file-type-validator/file-type-validator.directive';
import { GlobalFabDirective } from './directives/global-fab/global-fab.directive';
import { MaxValidatorDirective } from './directives/max-validator/max-validator.directive';
import { MinValidatorDirective } from './directives/min-validator/min-validator.directive';
import { SelectOnFocusDirective } from './directives/select-on-focus/select-on-focus.directive';
import { MatModule } from './mat.module';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CreateTransactionComponent } from './pages/create-transaction/create-transaction.component';
import { EditTransactionComponent } from './pages/edit-transaction/edit-transaction.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { WalletsComponent } from './pages/wallets/wallets.component';
import { LoadingPipe } from './pipes/loading/loading.pipe';
import { UserService } from './services/user/user.service';

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
	useValue: ['http://' + environment.firestoreEmulators.auth.join(':')],
};
const FirebaseCloudFunctionsEmulatorsProvider: Provider = {
	provide: USE_CLOUD_FUNCTIONS_EMULATOR,
	useValue: environment.firestoreEmulators.functions,
};
const FirebaseRegionProvider: Provider = {
	provide: REGION,
	useValue: 'us-central1',
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
		GroupedTransactionsChartComponent,
		CategorizedExpensesChartComponent,
		TransactionsTableComponent,
		TransactionsComponent,
		PaginatedTransactionsTableComponent,
		PaginatedFirestoreCollectionTableComponent,
		CurrencyInputDirective,
		MinValidatorDirective,
		TransactionFormComponent,
		CreateTransactionComponent,
		EditTransactionComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatModule,
		AngularFireModule.initializeApp(environment.firestore),
		AngularFireAuthModule,
		FormsModule,
		AngularFireStorageModule,
		AngularFireFunctionsModule,
		NgChartsModule,
	],
	providers: [
		PolishLocaleProvider,
		PolishCurrencyCodeProvider,
		FirebaseAuthEmulatorProvider,
		FirestoreEmulatorProvider,
		ErrorHandlerProvider,
		UserInitializerProvider,
		CluesDatasetsProvider,
		FirebaseCloudFunctionsEmulatorsProvider,
		FirebaseRegionProvider,
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

		if (environment.firestoreEmulators.useEmulators) {
			const [host, port] = environment.firestoreEmulators.storage;
			firebase.storage().useEmulator(<string>host, <number>port);
		}
	}
}
