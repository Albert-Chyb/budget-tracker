import { Injectable } from '@angular/core';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from '@angular/router';

export const DEFAULT_QUERY_PARAMETERS = Symbol('default-query-parameters-key');

@Injectable({
	providedIn: 'root',
})
export class DefaultQueryParametersGuard implements CanActivate {
	constructor(
		private readonly _router: Router,
		private readonly _route: ActivatedRoute
	) {}

	canActivate(
		routeSnap: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		const routeData = routeSnap.data as any;
		const queryParams = routeData[DEFAULT_QUERY_PARAMETERS];

		if (!state.url.includes('?')) {
			this._router.navigate([state.url], {
				relativeTo: this._route,
				queryParams,
			});

			return false;
		}

		return true;
	}
}
