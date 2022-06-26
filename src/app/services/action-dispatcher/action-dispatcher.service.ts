import { HostListener, Inject, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppError } from '@common/errors/app-error';
import { isNullish } from '@common/helpers/isNullish';
import { from, Observable, of, race, throwError } from 'rxjs';
import { catchError, first, mapTo, switchMap } from 'rxjs/operators';
import {
	ActionDefinition,
	ActionDefinitionConstructor,
} from 'src/app/actions/action-definition';
import { APP_ACTIONS } from 'src/app/actions/action-provider-token';

@Injectable({
	providedIn: 'root',
})
export class ActionDispatcherService<ActionPayload> {
	constructor(
		@Inject(APP_ACTIONS)
		private readonly actions: Map<string, ActionDefinitionConstructor<any>>,
		private readonly _injector: Injector,
		private readonly _snackbar: MatSnackBar
	) {}

	@HostListener('click')
	dispatch(actionName: string, payload?: ActionPayload): Observable<void> {
		const action = this._createAction(actionName, payload);
		const actionResult = this._standardizeResult(action.execute());

		return actionResult.pipe(
			first(),
			switchMap(() => {
				const snackbar = this._snackbar.open(action.onCompleteMsg, 'Cofnij');

				return race(
					snackbar.afterDismissed().pipe(mapTo(false)),
					snackbar.onAction().pipe(mapTo(true))
				).pipe(
					switchMap(shouldUndo =>
						shouldUndo ? this._standardizeResult(action.undo()) : of(null)
					)
				);
			}),
			catchError(this._catchError)
		);
	}

	/** Creates an action object associated with the name. */
	private _createAction(
		actionName: string,
		payload: ActionPayload
	): ActionDefinition<ActionPayload> {
		if (!this.actions.has(actionName)) {
			throw new Error(`No action with name ${actionName}`);
		}

		const ActionConstructor: ActionDefinitionConstructor<ActionPayload> =
			this.actions.get(actionName);

		return new ActionConstructor(this._injector, payload);
	}

	/** Converts the received value into an observable. */
	private _standardizeResult(result: any): Observable<void> {
		return isNullish(result) ? of(result) : <Observable<any>>from(result);
	}

	/** Method for rxjs' catchError operator. */
	private _catchError(error: any): Observable<any> {
		if (error instanceof AppError && error.code === 'action-cancelled') {
			return of(null);
		} else {
			return throwError(error);
		}
	}
}
