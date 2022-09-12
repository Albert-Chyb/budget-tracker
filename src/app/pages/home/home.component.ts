import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	LOCALE_ID,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { limit, orderBy } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Breakpoint } from '@common/breakpoints';
import { Money } from '@common/models/money';
import { PeriodStatistics } from '@common/models/period-statistics';
import { TimePeriod } from '@common/models/time-period';
import { distinctUntilKeysChanged } from '@common/rxjs-custom-operators/distinctUntilKeysChanged';
import {
	PeriodPickerComponent,
	TPeriodName,
	TPeriodPickerInjectorData,
	TPeriodPickerValue,
} from '@components/period-picker/period-picker.component';
import {
	IWalletPickerInjectorData,
	TWalletPickerValue,
	WalletPickerComponent,
} from '@components/wallet-picker/wallet-picker.component';
import { DEFAULT_CLUE_NAME } from '@directives/clue-if/clue-if.directive';
import { IWallet } from '@interfaces/wallet';
import { PrevPeriodComparison } from '@models/prev-period-comparison';
import { CategoriesService } from '@services/categories/categories.service';
import { LoadingService } from '@services/loading/loading.service';
import { MainSidenavService } from '@services/main-sidenav/main-sidenav.service';
import { TransactionsService } from '@services/transactions/transactions.service';
import { WalletsStatisticsService } from '@services/wallets-statistics/wallets-statistics.service';
import { WalletsService } from '@services/wallets/wallets.service';
import { combineLatest, Observable, Subscription } from 'rxjs';
import {
	distinctUntilChanged,
	distinctUntilKeyChanged,
	first,
	map,
	shareReplay,
	switchMap,
} from 'rxjs/operators';
import {
	largeLayout,
	mediumLayout,
	smallLayout,
	xSmallLayout,
} from './layouts';

enum QueryParamsKeys {
	Year = 'year',
	Month = 'month',
	Week = 'week',
	PeriodName = 'periodName',
	Wallet = 'wallet',
}

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: DEFAULT_CLUE_NAME,
			useValue: 'noWallets',
		},
	],
})
export class HomeComponent implements OnInit, OnDestroy {
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
		private readonly _loading: LoadingService,
		@Inject(LOCALE_ID) private readonly _localeId: string
	) {}

	private readonly _wallets$: Observable<IWallet[]> = this._wallets
		.list()
		.pipe(shareReplay());
	private _yearsSubscription: Subscription;
	private readonly _years$ = this._walletStatistics
		.availableYears()
		.pipe(shareReplay());

	readonly cols = 12;
	readonly rowHeightRem = 1;
	readonly gutterSizeRem = 0.5;
	readonly maxTransactionsCount = 8;

	/** Emits whenever the wallet changes */
	readonly selectedWallet$: Observable<string> = this._route.queryParamMap.pipe(
		map(params => params.get(QueryParamsKeys.Wallet)),
		distinctUntilChanged()
	);

	/** Emits whenever the period changes */
	readonly selectedPeriod$: Observable<TimePeriod> =
		this._route.queryParamMap.pipe(
			map(params => this._buildPeriodFromQueryParams(params)),
			distinctUntilKeysChanged(['year', 'month', 'week'])
		);

	/** Emits whenever statistics object has changed */
	private readonly _statistics$ = combineLatest([
		this.selectedPeriod$.pipe(distinctUntilKeyChanged('year')),
		this.selectedWallet$,
	]).pipe(
		switchMap(([period, wallet]) => {
			const { year } = period;
			let observable$: Observable<PeriodStatistics>;

			if (wallet === 'all') {
				// We want to retrieve statistic for a year
				observable$ = this._walletStatistics.year(year);
			} else {
				// We want to retrieve statistic for a specific wallet in a specified year
				observable$ = this._walletStatistics.wallet(wallet, year);
			}

			return this._loading.add(observable$);
		}),
		switchMap(yearStatistics =>
			this.selectedPeriod$.pipe(
				distinctUntilChanged(
					({ year: oldYear }, { year: newYear }) => oldYear !== newYear
				),
				map(({ month, week }) => {
					const periodStatistics: PeriodStatistics = yearStatistics.getNested(
						month,
						week
					);

					return periodStatistics;
				})
			)
		)
	);

	/**	The data source for the template */
	readonly data$ = combineLatest([
		this._wallets$,
		this._categories.list(),
		this._statistics$,
		this._transactions.query(
			limit(this.maxTransactionsCount),
			orderBy('date', 'desc')
		),
	]).pipe(
		map(([wallets, categories, statistics, transactions]) => ({
			wallets,
			categories,
			periodStatistics: statistics,
			comparison: new PrevPeriodComparison(statistics),
			transactions,
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

	ngOnInit() {
		this._yearsSubscription = this._years$.subscribe();
	}

	ngOnDestroy() {
		this._yearsSubscription?.unsubscribe();
	}

	/**
	 * Calculates total balance in targeted wallets.
	 * The target can be set to a single wallet or all of them.
	 * @param wallets Array of wallets
	 * @param target Targeted wallet's id or 'all' if all are targeted
	 * @returns
	 */
	getTotalBalance(wallets: IWallet[], target: string | 'all'): number {
		let balance: Money;

		if (target === 'all') {
			balance = wallets.reduce(
				(totalAmount, wallet) => totalAmount.add(wallet.balance),
				new Money(0, this._localeId)
			);
		} else {
			balance = wallets.find(
				wallet => wallet.id === this.selectedWallet
			).balance;
		}

		return balance.asDecimal;
	}

	onBarChartClick(statistics: PeriodStatistics) {
		if (statistics.period.name !== 'day') {
			this._setPeriodInQueryParams(statistics.period);
		}
	}

	/** Changes currently selected wallet. */
	async changeWallet() {
		const selectedWallet = await this._openWalletPicker();

		if (selectedWallet) {
			this._setWalletInQueryParams(selectedWallet);
		}
	}

	/** Changes currently selected period. */
	async changePeriod() {
		const newPeriod = await this._openPeriodPicker();

		if (newPeriod) {
			this._setPeriodInQueryParams(newPeriod);
		}
	}

	/** Currently selected wallet. */
	get selectedWallet(): string {
		return this._route.snapshot.queryParamMap.get(QueryParamsKeys.Wallet);
	}

	/** Currently selected period */
	get selectedPeriod() {
		return this._buildPeriodFromQueryParams(this._route.snapshot.queryParamMap);
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
		return this._openPicker<
			PeriodPickerComponent,
			TPeriodPickerInjectorData,
			TPeriodPickerValue
		>(PeriodPickerComponent, {
			value: this.selectedPeriod,
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

	private _buildPeriodFromQueryParams(params: ParamMap): TimePeriod {
		const paramsNames: TPeriodName[] = [
			QueryParamsKeys.Year,
			QueryParamsKeys.Month,
			QueryParamsKeys.Week,
		];

		const [year, month, week] = paramsNames.map(paramName => {
			if (params.has(paramName)) {
				return Number(params.get(paramName));
			} else {
				return null;
			}
		});

		return new TimePeriod(year, month, week);
	}

	private _setPeriodInQueryParams(period: TimePeriod) {
		const { year, month, week } = period;

		return this._router.navigate([], {
			relativeTo: this._route,
			queryParamsHandling: 'merge',
			queryParams: { year, month, week },
			replaceUrl: true,
		});
	}

	private _setWalletInQueryParams(wallet: string) {
		return this._router.navigate([], {
			relativeTo: this._route,
			queryParamsHandling: 'merge',
			queryParams: { wallet },
			replaceUrl: true,
		});
	}
}
