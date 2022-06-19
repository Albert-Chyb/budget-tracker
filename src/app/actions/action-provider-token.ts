import { InjectionToken } from '@angular/core';
import { ActionDefinitionConstructor } from './action-definition';

export const APP_ACTIONS = new InjectionToken<
	Map<string, ActionDefinitionConstructor<any>>
>('APP_ACTIONS', { factory: () => new Map() });

export const APP_ACTION = new InjectionToken<ActionDefinitionConstructor<any>>(
	'APP_ACTION'
);
