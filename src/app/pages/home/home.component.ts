import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';
import { Breakpoint } from 'src/app/common/breakpoints';
import { ICategory } from 'src/app/common/interfaces/category';
import { ITransaction } from 'src/app/common/interfaces/transaction';
import { IWallet } from 'src/app/common/interfaces/wallet';
import {
	IWalletPeriodStatistics,
	TWalletCategorizedStatistics,
} from 'src/app/common/interfaces/wallet-statistics';
import {
	PeriodPickerComponent,
	TPeriodPickerValue,
} from 'src/app/components/period-picker/period-picker.component';
import {
	TWalletPickerValue,
	WalletPickerComponent,
} from 'src/app/components/wallet-picker/wallet-picker.component';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MainSidenavService } from 'src/app/services/main-sidenav/main-sidenav.service';
import { WalletsStatisticsService } from 'src/app/services/wallets-statistics/wallets-statistics.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';
import {
	largeLayout,
	mediumLayout,
	smallLayout,
	xSmallLayout,
} from './layouts';

/*
 * The dialogs probably shouldn't call for data every time they are opened. Get data in this component and pass it to a dialog with injector.
 * Adjust charts theme to the dark background.
 *
 * Integrate this component with backend.
 */

const DEFAULT_WALLET_PICKER_VALUE: TWalletPickerValue = 'all';
const DEFAULT_PERIOD_PICKER_VALUE: TPeriodPickerValue = [
	new Date().getFullYear(),
	null,
	null,
	'year',
];

const DUMMY_DATA: TWalletCategorizedStatistics = {
	'1a': {
		expenses: 15,
		income: 1,
	},
	'2b': {
		expenses: 15,
		income: 1,
	},
	'3c': {
		expenses: 60,
		income: 1,
	},
	'4d': {
		expenses: 12,
		income: 1,
	},
	'5f': {
		expenses: 100,
		income: 1,
	},
};

const DUMMY_CATEGORIES: ICategory[] = [
	{
		id: '1a',
		name: 'Jedzenie',

		icon: '',
		iconPath: '',
		defaultTransactionsType: 'expense',
	},
	{
		id: '2b',
		name: 'Paliwo',

		icon: '',
		iconPath: '',
		defaultTransactionsType: 'expense',
	},
	{
		id: '3c',
		name: 'Rozrywka',

		icon: '',
		iconPath: '',
		defaultTransactionsType: 'expense',
	},
	{
		id: '4d',
		name: 'Transport',

		icon: '',
		iconPath: '',
		defaultTransactionsType: 'expense',
	},
	{
		id: '5f',
		name: 'Imprezy',

		icon: '',
		iconPath: '',
		defaultTransactionsType: 'expense',
	},
];

const DUMMY_PERIOD_DATA: IWalletPeriodStatistics = {
	expenses: 1,
	income: 2,
	categories: null,
	'0': {
		expenses: 100,
		income: 47,
		categories: null,
	},
	'5': {
		expenses: 85,
		income: 34,
		categories: null,
	},
	'1': {
		expenses: 45,
		income: 12,
		categories: null,
	},
};

const DUMMY_TRANSACTIONS: ITransaction[] = [
	{
		amount: 23.3,
		type: 'expense',
		category: 'Jedzenie',
		wallet: 'Konto bankowe',
		date: new Date(2021, 11, 1),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 52.3,
		type: 'expense',
		category: 'Imprezy',
		wallet: 'Konto bankowe',
		date: new Date(2021, 11, 2),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 12.3,
		type: 'expense',
		category: 'Transport',
		wallet: 'Portfel',
		date: new Date(2021, 11, 3),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 50,
		type: 'income',
		category: 'Kieszonkowe',
		wallet: 'Konto bankowe',
		date: new Date(2021, 11, 4),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 2300,
		type: 'income',
		category: 'Pensja',
		wallet: 'Konto oszczędnościowe',
		date: new Date(2021, 11, 5),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 23.3,
		type: 'expense',
		category: 'Inne',
		wallet: 'Konto bankowe',
		date: new Date(2021, 11, 6),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 23.3,
		type: 'expense',
		category: 'Jedzenie',
		wallet: 'Konto bankowe',
		date: new Date(2021, 11, 1),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 52.3,
		type: 'expense',
		category: 'Imprezy',
		wallet: 'Konto bankowe',
		date: new Date(2021, 11, 2),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 12.3,
		type: 'expense',
		category: 'Transport',
		wallet: 'Portfel',
		date: new Date(2021, 11, 3),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 50,
		type: 'income',
		category: 'Kieszonkowe',
		wallet: 'Konto bankowe',
		date: new Date(2021, 11, 4),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 2300,
		type: 'income',
		category: 'Pensja',
		wallet: 'Konto oszczędnościowe',
		date: new Date(2021, 11, 5),
		description: '',
		id: 'aslffsdg',
	},
	{
		amount: 23.3,
		type: 'expense',
		category: 'Inne',
		wallet: 'Konto bankowe',
		date: new Date(2021, 11, 6),
		description: '',
		id: 'aslffsdg',
	},
];

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	constructor(
		private readonly _dialog: MatDialog,
		private readonly _breakpointObserver: BreakpointObserver,
		private readonly _mainSidenav: MainSidenavService,
		private readonly _walletStatistics: WalletsStatisticsService,
		private readonly _wallets: WalletsService,
		private readonly _categories: CategoriesService
	) {}

	readonly cols = 12;
	readonly rowHeightRem = 1;
	readonly gutterSizeRem = 0.5;

	readonly data$ = combineLatest([
		this._wallets.list(),
		this._categories.list(),
		this._walletStatistics.year(2021),
	]).pipe(
		map(([wallets, categories, statistics]) => ({
			wallets,
			categories,
			statistics,
		}))
	);

	// TODO: Remove this
	readonly DUMMY_TRANSACTIONS = DUMMY_TRANSACTIONS;

	private readonly _layouts = new Map([
		['(max-width: 374.98px)', xSmallLayout],
		[Breakpoint.XSmall, smallLayout],
		[Breakpoint.Small, smallLayout],
		[Breakpoint.Medium, mediumLayout],
		[Breakpoint.Large, largeLayout],
		[Breakpoint.XLarge, largeLayout],
		[Breakpoint.XXLarge, largeLayout],
	]);
	private readonly _drawerLayouts = new Map([
		['(max-width: 374.98px)', xSmallLayout],
		[Breakpoint.XSmall, smallLayout],
		[Breakpoint.Small, smallLayout],
		[Breakpoint.Medium, smallLayout],
		[Breakpoint.Large, mediumLayout],
		[Breakpoint.XLarge, largeLayout],
		[Breakpoint.XXLarge, largeLayout],
	]);
	readonly layout$ = this._mainSidenav.isOpened$.pipe(
		map(isOpened => (isOpened ? this._drawerLayouts : this._layouts)),
		switchMap(layout => {
			return this._breakpointObserver.observe(Array.from(layout.keys())).pipe(
				map(state => {
					const [breakpoint] = Object.entries(state.breakpoints).find(
						([, isMatching]) => isMatching
					);

					return layout.get(breakpoint as Breakpoint);
				}),
				distinctUntilChanged()
			);
		})
	);

	private readonly _walletStream$ = new BehaviorSubject<TWalletPickerValue>(
		DEFAULT_WALLET_PICKER_VALUE
	);
	private readonly _periodStream$ = new BehaviorSubject<TPeriodPickerValue>(
		DEFAULT_PERIOD_PICKER_VALUE
	);
	readonly wallet$ = this._walletStream$.asObservable();
	readonly period$ = this._periodStream$.asObservable();

	getTotalBalance(wallets: IWallet[]): number {
		const targetedWalletId = this._walletStream$.value;

		if (targetedWalletId === 'all') {
			return wallets.reduce(
				(totalAmount, wallet) => totalAmount + wallet.balance,
				0
			);
		} else {
			return wallets.find(wallet => wallet.id === targetedWalletId).balance;
		}
	}

	getIncome(statistics: IWalletPeriodStatistics) {
		const [year, month, week, selectedPeriod] = this._periodStream$.value;
		let income: number;

		if (selectedPeriod === 'year') {
			income = statistics.income;
		} else if (selectedPeriod === 'month') {
			income = (statistics as any)[String(month)].income;
		} else if (selectedPeriod === 'week') {
			income = (statistics as any)[String(month)][String(week)].income;
		}

		return income;
	}

	getExpenses(statistics: IWalletPeriodStatistics) {
		const [year, month, week, selectedPeriod] = this._periodStream$.value;
		let expenses: number;

		if (selectedPeriod === 'year') {
			expenses = statistics.expenses;
		} else if (selectedPeriod === 'month') {
			expenses = (statistics as any)[String(month)].expenses;
		} else if (selectedPeriod === 'week') {
			expenses = (statistics as any)[String(month)][String(week)].expenses;
		}

		return expenses;
	}

	getDifference(statistics: IWalletPeriodStatistics): number {
		return this.getIncome(statistics) - this.getExpenses(statistics);
	}

	async changeDataSource() {
		const newDataSource = await this._openWalletPicker();

		if (newDataSource) {
			this._walletStream$.next(newDataSource);
		}

		console.log(newDataSource);
	}

	async changePeriod() {
		const newPeriod = await this._openPeriodPicker();

		if (newPeriod) {
			const [year, month, week, period] = newPeriod;

			this._periodStream$.next(newPeriod);

			console.log({ year, month, week, period });
		}
	}

	private _openWalletPicker() {
		return this._openPicker<
			WalletPickerComponent,
			TWalletPickerValue,
			TWalletPickerValue
		>(WalletPickerComponent, this._walletStream$.value);
	}

	private _openPeriodPicker() {
		return this._openPicker<
			PeriodPickerComponent,
			TPeriodPickerValue,
			TPeriodPickerValue
		>(
			PeriodPickerComponent,
			this._periodStream$.value ?? [null, null, null, null]
		);
	}

	private _openPicker<DialogComponent, InjectorData, CloseValue>(
		Component: ComponentType<DialogComponent>,
		data?: InjectorData
	) {
		return this._dialog
			.open<DialogComponent, InjectorData, CloseValue>(Component, {
				width: '30rem',
				data,
			})
			.afterClosed()
			.pipe(first())
			.toPromise();
	}
}
