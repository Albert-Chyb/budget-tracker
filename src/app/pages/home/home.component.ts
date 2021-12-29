import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import {
	distinctUntilChanged,
	first,
	map,
	shareReplay,
	switchMap,
} from 'rxjs/operators';
import { Breakpoint } from 'src/app/common/breakpoints';
import { IWallet } from 'src/app/common/interfaces/wallet';
import {
	WalletStatistics,
	WalletYearStatistics,
} from 'src/app/common/models/wallet-statistics';
import {
	PeriodPickerComponent,
	TPeriodName,
	TPeriodPickerInjectorData,
	TPeriodPickerValue,
} from 'src/app/components/period-picker/period-picker.component';
import {
	IWalletPickerInjectorData,
	TWalletPickerValue,
	WalletPickerComponent,
} from 'src/app/components/wallet-picker/wallet-picker.component';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { MainSidenavService } from 'src/app/services/main-sidenav/main-sidenav.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { WalletsStatisticsService } from 'src/app/services/wallets-statistics/wallets-statistics.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';
import {
	largeLayout,
	mediumLayout,
	smallLayout,
	xSmallLayout,
} from './layouts';

/*
 * Adjust charts theme to the dark background.
 * When user clicks on bar chart a period, the dashboard should switch to that period. (it is a little time saver)
 
 * Create a method that creates period picker value from query params.
 * Create a function that compares 2 objects
*/

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
		private readonly _transactions: TransactionsService,
		private readonly _categories: CategoriesService,
		private readonly _route: ActivatedRoute,
		private readonly _router: Router,
		private readonly _loading: LoadingService
	) {}

	private readonly _wallets$: Observable<IWallet[]> = this._wallets
		.list()
		.pipe(shareReplay());

	private readonly _years$ = this._walletStatistics
		.availableYears()
		.pipe(shareReplay());

	readonly cols = 12;
	readonly rowHeightRem = 1;
	readonly gutterSizeRem = 0.5;

	readonly maxTransactionsCount = 8;

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
				const [year, month, week] = this._buildPeriodDateParts(params);

				return {
					periodName: params.get('periodName') as TPeriodName,
					year,
					month,
					week,
				};
			}),
			distinctUntilChanged((oldPeriod, newPeriod) => {
				return (
					oldPeriod.year === newPeriod.year &&
					oldPeriod.month === newPeriod.month &&
					oldPeriod.week === newPeriod.week &&
					oldPeriod.periodName === newPeriod.periodName
				);
			})
		);

	/** Emits whenever statistics object has changed */
	private readonly _statistics$ = combineLatest([
		this.selectedPeriod$.pipe(
			distinctUntilChanged(
				({ year: oldYear }, { year: newYear }) => oldYear === newYear
			)
		),
		this.selectedWallet$,
	]).pipe(
		switchMap(([period, wallet]) => {
			const { year } = period;
			let observable$: Observable<WalletYearStatistics>;

			if (wallet === 'all') {
				// We want to retrieve statistic for a year
				observable$ = this._walletStatistics.year(year);
			} else {
				// We want to retrieve statistic for a specific wallet in a specified year
				observable$ = this._walletStatistics.wallet(wallet, year);
			}

			return this._loading.add(observable$);
		}),
		switchMap(statistics =>
			this.selectedPeriod$.pipe(
				distinctUntilChanged(
					({ year: oldYear }, { year: newYear }) => oldYear !== newYear
				),
				map(({ month, week, periodName }) => {
					let periodStatistics: WalletStatistics;
					let prevPeriodStatistics: WalletStatistics;

					switch (periodName) {
						case 'year':
							periodStatistics = statistics;
							break;

						case 'month':
							periodStatistics = statistics.getPeriod(month);

							if (month > 0) {
								prevPeriodStatistics = statistics.getPeriod(month - 1);
							}
							break;

						case 'week':
							periodStatistics = statistics.getPeriod(month).getPeriod(week);

							if (week - 1 < 0) {
								prevPeriodStatistics = statistics.getPeriod(
									month - 1
								).lastPeriod;
							} else {
								prevPeriodStatistics = statistics
									.getPeriod(month)
									.getPeriod(week - 1);
							}
							break;
					}

					return { periodStatistics, prevPeriodStatistics };
				})
			)
		)
	);

	/**	The data source for the template */
	readonly data$ = combineLatest([
		this._wallets$,
		this._categories.list(),
		this._statistics$,
		this._transactions.query(queries =>
			queries.limit(this.maxTransactionsCount).orderBy('date', 'desc')
		),
		this._years$,
	]).pipe(
		map(([wallets, categories, statistics, transactions, years]) => ({
			wallets,
			categories,
			statistics: statistics.periodStatistics,
			prevPeriodStatistics: statistics.prevPeriodStatistics,
			transactions,
			years,
		}))
	);

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

	/**
	 * Calculates total balance in targeted wallets.
	 * The target can be set to a single wallet or all of them.
	 * @param wallets Array of wallets
	 * @param target Targeted wallet's id or 'all' if all are targeted
	 * @returns
	 */
	getTotalBalance(wallets: IWallet[], target: string | 'all'): number {
		if (target === 'all') {
			return wallets.reduce(
				(totalAmount, wallet) => totalAmount + wallet.balance,
				0
			);
		} else {
			return wallets.find(wallet => wallet.id === this.selectedWallet).balance;
		}
	}

	/**
	 * Calculates percentage change.
	 * @param newValue Current value
	 * @param original Older value
	 * @returns Percentage change
	 */
	percentageChange(newValue: number, original: number | null): number {
		if (original === null) {
			return null;
		}

		const delta = newValue - original;

		return original === 0 ? 0 : (delta / original) * 100;
	}

	/**
	 * Formats number as a percentage. Appends the number sign and '%' sign.
	 * @param number Number to format
	 */
	formatPercentageChange(number: number): string {
		let result: string = String(Math.trunc(number));

		if (Math.sign(number) === 1) {
			result = `+${result}`;
		} else if (Math.sign(number) === 0) {
			result = `+${result}`;
		}

		return `${result}%`;
	}

	/**
	 * Checks if the new value increased, decreased or is the same.
	 * @param newValue Current value
	 * @param original Older value
	 * @returns CSS class name
	 */
	percentageChangeType(newValue: number, original: number) {
		let type: 'increase' | 'decrease' | 'no-change';

		if (newValue === original || original === 0) {
			type === 'no-change';
		} else if (newValue > original) {
			type = 'increase';
		} else {
			type = 'decrease';
		}

		return type;
	}

	/** Changes currently selected wallet. */
	async changeWallet() {
		const selectedWallet = await this._openWalletPicker();

		if (selectedWallet) {
			this._setQueryParams({ wallet: selectedWallet });
		}
	}

	/** Changes currently selected period. */
	async changePeriod() {
		const newPeriod = await this._openPeriodPicker();

		if (newPeriod) {
			const { year, month, week, periodName } = newPeriod;

			this._setQueryParams({ year, month, week, periodName });
		}
	}

	/** Currently selected wallet. */
	get selectedWallet(): string {
		return this._route.snapshot.queryParamMap.get('wallet');
	}

	/** Currently selected period's name */
	get selectedPeriod(): TPeriodName {
		return this._route.snapshot.queryParamMap.get('periodName') as TPeriodName;
	}

	/** Currently selected period */
	get selectedPeriodParts(): [number, number, number] {
		return this._buildPeriodDateParts(this._route.snapshot.queryParamMap);
	}

	private _openWalletPicker(): Promise<TWalletPickerValue> {
		return this._openPicker<
			WalletPickerComponent,
			IWalletPickerInjectorData,
			TWalletPickerValue
		>(WalletPickerComponent, {
			value: this.selectedWallet,
			wallets$: this._wallets$,
		});
	}

	private _openPeriodPicker(): Promise<TPeriodPickerValue> {
		const [year, month, week] = this.selectedPeriodParts;

		return this._openPicker<
			PeriodPickerComponent,
			TPeriodPickerInjectorData,
			TPeriodPickerValue
		>(PeriodPickerComponent, {
			value: {
				year,
				month,
				week,
				periodName: this.selectedPeriod,
			},
			years$: this._years$,
		});
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

	private _buildPeriodDateParts(params: ParamMap): [number, number, number] {
		const paramsNames: TPeriodName[] = ['year', 'month', 'week'];

		const [year, month, week] = paramsNames.map(paramName => {
			if (params.has(paramName)) {
				return Number(params.get(paramName));
			} else {
				return null;
			}
		});

		return [year, month, week];
	}

	private _setQueryParams(queryParams: Params) {
		return this._router.navigate([], {
			relativeTo: this._route,
			queryParamsHandling: 'merge',
			queryParams,
			replaceUrl: true,
		});
	}
}
