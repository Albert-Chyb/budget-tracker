import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';
import { Breakpoint } from 'src/app/common/breakpoints';
import { ITransaction } from 'src/app/common/interfaces/transaction';
import { IWallet } from 'src/app/common/interfaces/wallet';
import {
	IWalletPeriodStatistics,
	TWalletCategorizedStatistics,
} from 'src/app/common/interfaces/wallet-statistics';
import {
	PeriodPickerComponent,
	TPeriod,
	TPeriodPickerValue,
} from 'src/app/components/period-picker/period-picker.component';
import {
	TWalletPickerValue,
	WalletPickerComponent,
} from 'src/app/components/wallet-picker/wallet-picker.component';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
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
 * Make a class for the statistics object.
 * Filter categories that contains no expenses in pie chart.
 * Change period picker value to an object
 * Integrate this component with backend.
 * Implement comparison with the last period (in a year scope).
 */

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
		private readonly _categories: CategoriesService,
		private readonly _route: ActivatedRoute,
		private readonly _router: Router,
		private readonly _loading: LoadingService
	) {}

	readonly cols = 12;
	readonly rowHeightRem = 1;
	readonly gutterSizeRem = 0.5;

	/** Emits whenever the wallet changes */
	readonly selectedWallet$: Observable<TWalletPickerValue> =
		this._route.queryParamMap.pipe(
			map(params => params.get('wallet')),
			distinctUntilChanged()
		);

	/** Emits whenever the period changes */
	readonly selectedPeriod$: Observable<TPeriodPickerValue> =
		this._route.queryParamMap.pipe(
			map(params => {
				return [
					...this._buildPeriodParts(params),
					params.get('period') as TPeriod,
				] as [number, number, number, TPeriod];
			})
		);

	/**
	 * Emits whenever a new statistics object should be downloaded from the server.
	 * When a new year or wallet was selected.
	 */
	private readonly _statistics$ = combineLatest([
		this.selectedPeriod$.pipe(
			distinctUntilChanged(([oldYear], [newYear]) => oldYear === newYear)
		),
		this.selectedWallet$,
	]).pipe(
		switchMap(([period, wallet]) => {
			const [year] = period;

			if (wallet === 'all') {
				// We want to retrieve statistic for a year
				return this._loading.add(this._walletStatistics.year(year));
			} else {
				// We want to retrieve statistic for specific wallet in a specified year
				return this._loading.add(this._walletStatistics.wallet(wallet, year));
			}
		})
	);

	readonly data$ = combineLatest([
		this._wallets.list(),
		this._categories.list(),
		this._statistics$,
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

	getTotalBalance(wallets: IWallet[]): number {
		if (this.selectedWallet === 'all') {
			return wallets.reduce(
				(totalAmount, wallet) => totalAmount + wallet.balance,
				0
			);
		} else {
			return wallets.find(wallet => wallet.id === this.selectedWallet).balance;
		}
	}

	getIncome(statistics: IWalletPeriodStatistics) {
		const [year, month, week] = this.selectedPeriodParts;
		let income: number;

		if (this.selectedPeriod === 'year') {
			income = statistics?.income;
		} else if (this.selectedPeriod === 'month') {
			income = (statistics as any)?.[String(month)]?.income ?? 0;
		} else if (this.selectedPeriod === 'week') {
			income =
				(statistics as any)?.[String(month)]?.[String(week)]?.income ?? 0;
		}

		return income;
	}

	getExpenses(statistics: IWalletPeriodStatistics) {
		const [year, month, week] = this.selectedPeriodParts;
		let expenses: number;

		if (this.selectedPeriod === 'year') {
			expenses = statistics?.expenses;
		} else if (this.selectedPeriod === 'month') {
			expenses = (statistics as any)?.[String(month)]?.expenses ?? 0;
		} else if (this.selectedPeriod === 'week') {
			expenses =
				(statistics as any)?.[String(month)]?.[String(week)]?.expenses ?? 0;
		}

		return expenses;
	}

	getDifference(statistics: IWalletPeriodStatistics): number {
		return this.getIncome(statistics) - this.getExpenses(statistics);
	}

	getStatisticsForPeriod(
		statistics: IWalletPeriodStatistics,
		period: TPeriod
	): IWalletPeriodStatistics {
		switch (period) {
			case 'year':
				return statistics;

			case 'month':
				return (statistics as any)[String(this.selectedPeriodParts[1])];

			case 'week':
				return (statistics as any)[String(this.selectedPeriodParts[1])][
					String(this.selectedPeriodParts[2])
				];
		}
	}

	getCategorizedStatistics(
		statistics: IWalletPeriodStatistics,
		period: TPeriod
	): TWalletCategorizedStatistics {
		return this.getStatisticsForPeriod(statistics, period).categories;
	}

	async changeWallet() {
		const selectedWallet = await this._openWalletPicker();

		if (selectedWallet) {
			this._router.navigate([], {
				relativeTo: this._route,
				queryParamsHandling: 'merge',
				queryParams: {
					wallet: selectedWallet,
				},
				replaceUrl: true,
			});
		}
	}

	async changePeriod() {
		const newPeriod = await this._openPeriodPicker();

		if (newPeriod) {
			const [year, month, week, period] = newPeriod;

			this._router.navigate([], {
				relativeTo: this._route,
				queryParamsHandling: 'merge',
				queryParams: { year, month, week, period },
				replaceUrl: true,
			});
		}
	}

	get selectedWallet(): string {
		return this._route.snapshot.queryParamMap.get('wallet');
	}

	get selectedPeriod(): TPeriod {
		return this._route.snapshot.queryParamMap.get('period') as any;
	}

	get selectedPeriodParts(): [number, number, number] {
		return this._buildPeriodParts(this._route.snapshot.queryParamMap);
	}

	private _openWalletPicker() {
		return this._openPicker<
			WalletPickerComponent,
			TWalletPickerValue,
			TWalletPickerValue
		>(WalletPickerComponent, this.selectedWallet);
	}

	private _openPeriodPicker() {
		return this._openPicker<
			PeriodPickerComponent,
			TPeriodPickerValue,
			TPeriodPickerValue
		>(PeriodPickerComponent, [
			...this.selectedPeriodParts,
			this.selectedPeriod,
		]);
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

	private _buildPeriodParts(params: ParamMap): [number, number, number] {
		const paramsNames: TPeriod[] = ['year', 'month', 'week'];

		const periodParts = paramsNames.map(paramName => {
			if (params.has(paramName)) {
				return Number(params.get(paramName));
			} else {
				return null;
			}
		});

		return periodParts as any;
	}
}
