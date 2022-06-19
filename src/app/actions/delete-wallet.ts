import { IWallet } from '@common/interfaces/wallet';
import { LoadingService } from '@services/loading/loading.service';
import { WalletsService } from '@services/wallets/wallets.service';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ActionDefinition } from './action-definition';

export class DeleteWalletAction extends ActionDefinition<IWallet> {
	private readonly _wallets = this.getDependency(WalletsService);
	private readonly _loading = this.getDependency(LoadingService);

	readonly onCompleteMsg: string = `Usunięto portfel: ${this.payload.name}`;

	execute(): Observable<void> {
		return this._loading.add(this._wallets.delete(this.payload.id));
	}

	undo(): Observable<void> {
		return this._loading.add(
			this._wallets
				.create(
					{
						name: this.payload.name,
						balance: this.payload.balance,
					},
					this.payload.id
				)
				.pipe(mapTo(null))
		);
	}
}
