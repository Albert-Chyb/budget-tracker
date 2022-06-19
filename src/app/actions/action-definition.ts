import { Injector, ProviderToken } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class ActionDefinition<Payload> {
	constructor(
		private readonly _injector: Injector,
		protected payload?: Payload
	) {}

	abstract onCompleteMsg: string;

	abstract execute(): void | Observable<void> | Promise<void>;
	abstract undo(): void | Observable<void> | Promise<void>;

	protected getDependency<T>(dependency: ProviderToken<T>) {
		return this._injector.get(dependency);
	}
}

export type ActionDefinitionConstructor<Payload> = new (
	injector: Injector,
	payload?: Payload,
	...args: any
) => ActionDefinition<Payload>;
