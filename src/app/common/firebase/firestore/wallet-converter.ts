import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from '@angular/fire/firestore';
import { Money } from '@common/models/money';
import { IWallet, IWalletBase, IWalletReadPayload } from '@interfaces/wallet';

export class FirestoreWalletConverter
	implements FirestoreDataConverter<IWalletBase>
{
	constructor(private readonly _localeId: string) {}

	toFirestore(wallet: IWalletBase): DocumentData {
		const documentData = {
			name: wallet.name,
			...('balance' in wallet && { balance: wallet.balance.asInteger }),
		};

		return documentData;
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot<IWalletReadPayload>,
		options: SnapshotOptions
	): IWallet {
		const data = snapshot.data();

		return {
			...data,
			id: snapshot.id,
			balance: new Money(data.balance, this._localeId),
		};
	}
}
