import {
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from '@angular/fire/firestore';
import { IWallet, IWalletBase } from '../interfaces/wallet';

export class FirestoreWalletConverter
	implements FirestoreDataConverter<IWalletBase>
{
	toFirestore(wallet: IWalletBase): IWalletBase {
		wallet.balance = ~~(wallet.balance * 100);

		return wallet;
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot<IWalletBase>,
		options: SnapshotOptions
	): IWallet {
		const data = snapshot.data();

		return { ...data, id: snapshot.id, balance: data.balance / 100 };
	}
}
