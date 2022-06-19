import { AppError } from '@common/errors/app-error';
import { isNullish } from '@common/helpers/isNullish';
import { IWallet } from '@common/interfaces/wallet';
import { LoadingService } from '@services/loading/loading.service';
import { PromptService } from '@services/prompt/prompt.service';
import { WalletsService } from '@services/wallets/wallets.service';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActionDefinition } from './action-definition';

export class RenameWalletAction extends ActionDefinition<IWallet> {
	readonly onCompleteMsg: string = `Zmieniono nazwę portfelu: ${this.payload.name}`;

	private readonly _wallets = this.getDependency(WalletsService);
	private readonly _prompt = this.getDependency(PromptService);
	private readonly _loading = this.getDependency(LoadingService);

	execute(): Observable<void> {
		return this._prompt
			.open({
				title: 'Zmiana nazwy portfela',
				label: 'Nowa nazwa',
				value: this.payload.name,
			})
			.pipe(
				switchMap(newName => {
					if (isNullish(newName) || newName === this.payload.name)
						return throwError(
							new AppError(
								'The name did not change or new name is nullish.',
								'action-cancelled'
							)
						);

					return this._loading.add(
						this._wallets.update(this.payload.id, { name: newName })
					);
				})
			);
	}

	undo(): Observable<void> {
		return this._loading.add(
			this._wallets.update(this.payload.id, { name: this.payload.name })
		);
	}
}
