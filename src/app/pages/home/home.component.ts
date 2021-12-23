import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';
import { Breakpoint } from 'src/app/common/breakpoints';
import { compareArrays } from 'src/app/common/helpers/compareArrays';
import { IWallet } from 'src/app/common/interfaces/wallet';
import {
	WalletStatistics,
	WalletYearStatistics,
} from 'src/app/common/models/wallet-statistics';
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
 * The dialogs probably shouldn't call for data every time they are opened. Get data in this component and pass it to a dialog with injector.
 * Adjust charts theme to the dark background.
 * Implement comparison with the last period (in a year scope).
 * When user clicks on bar chart a period, the dashboard should switch to that period. (it is a little time saver)
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
				return [
					...this._buildPeriodParts(params),
					params.get('period') as TPeriod,
				] as TPeriodPickerValue;
			}),
			distinctUntilChanged((oldPeriod, newPeriod) =>
				compareArrays(oldPeriod, newPeriod)
			)
		);

	/** Emits whenever statistics object has changed */
	private readonly _statistics$ = combineLatest([
		this.selectedPeriod$.pipe(
			distinctUntilChanged(([oldYear], [newYear]) => oldYear === newYear)
		),
		this.selectedWallet$,
	]).pipe(
		switchMap(([period, wallet]) => {
			const [year] = period;
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
				distinctUntilChanged(([oldYear], [newYear]) => oldYear !== newYear),
				map(([year, month, week, period]) => {
					let periodStatistics: WalletStatistics;

					switch (period) {
						case 'year':
							periodStatistics = statistics;
							break;

						case 'month':
							periodStatistics = statistics.getPeriod(month);
							break;

						case 'week':
							periodStatistics = statistics.getPeriod(month).getPeriod(week);
							break;
					}

					return periodStatistics;
				})
			)
		)
	);

	/**	The data source for the template */
	readonly data$ = combineLatest([
		this._wallets.list(),
		this._categories.list(),
		this._statistics$,
		this._transactions.query(queries =>
			queries.limit(this.maxTransactionsCount).orderBy('date', 'desc')
		),
	]).pipe(
		map(([wallets, categories, statistics, transactions]) => ({
			wallets,
			categories,
			statistics,
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

	async changeWallet() {
		const selectedWallet = await this._openWalletPicker();

		if (selectedWallet) {
			this._setQueryParams({ wallet: selectedWallet });
		}
	}

	async changePeriod() {
		const newPeriod = await this._openPeriodPicker();

		if (newPeriod) {
			const [year, month, week, period] = newPeriod;

			this._setQueryParams({ year, month, week, period });
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

	private _openWalletPicker(): Promise<TWalletPickerValue> {
		return this._openPicker<
			WalletPickerComponent,
			TWalletPickerValue,
			TWalletPickerValue
		>(WalletPickerComponent, this.selectedWallet);
	}

	private _openPeriodPicker(): Promise<TPeriodPickerValue> {
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

	private _setQueryParams(queryParams: Params) {
		return this._router.navigate([], {
			relativeTo: this._route,
			queryParamsHandling: 'merge',
			queryParams,
			replaceUrl: true,
		});
	}
}
