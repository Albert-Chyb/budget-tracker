import { Injectable } from '@angular/core';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	CanActivate,
	ParamMap,
	Params,
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
		const defaultParams: Params = routeData[DEFAULT_QUERY_PARAMETERS];

		if (!defaultParams) {
			throw new Error('Default query parameters of this route are not set.');
		}

		if (
			!this._allDefaultParamsPresent(routeSnap.queryParamMap, defaultParams)
		) {
			this._router.navigate([state.url], {
				relativeTo: this._route,
				queryParams: defaultParams,
			});

			return false;
		}

		return true;
	}

	/** Checks if all default params are present in the query param map. */
	private _allDefaultParamsPresent(
		routeQueryParams: ParamMap,
		defaultParams: Params
	): boolean {
		return Object.keys(defaultParams).every(defaultKey =>
			routeQueryParams.has(defaultKey)
		);
	}
}
