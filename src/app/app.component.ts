import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Breakpoint } from './common/breakpoints';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	host: {
		class: 'with-fixed-mat-toolbar',
	},
})
export class AppComponent {
	constructor(private readonly _breakpointObserver: BreakpointObserver) {}

	private readonly _correspondingMode: Map<Breakpoint, MatDrawerMode> = new Map(
		[
			[Breakpoint.XSmall, 'over'],
			[Breakpoint.Small, 'over'],
			[Breakpoint.Medium, 'side'],
			[Breakpoint.Large, 'side'],
			[Breakpoint.XLarge, 'side'],
			[Breakpoint.XXLarge, 'side'],
		]
	);

	sidenavMode$: Observable<MatDrawerMode> = this._breakpointObserver
		.observe([
			Breakpoint.XSmall,
			Breakpoint.Small,
			Breakpoint.Medium,
			Breakpoint.Large,
			Breakpoint.XLarge,
			Breakpoint.XXLarge,
		])
		.pipe(
			map(result => {
				const breakpoints = Object.entries(result.breakpoints);

				return breakpoints.find(([, value]) => value)[0];
			}),
			map(breakpoint => {
				return this._correspondingMode.get(breakpoint as any) ?? null;
			}),
			distinctUntilChanged()
		);
}
