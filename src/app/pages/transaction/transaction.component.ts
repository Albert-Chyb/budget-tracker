import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ICategory } from 'src/app/common/interfaces/category';
import {
	ITransaction,
	ITransactionBase,
	TTransactionType,
} from 'src/app/common/interfaces/transaction';
import { IWallet } from 'src/app/common/interfaces/wallet';
import { moneyAmountPattern } from 'src/app/common/validators/money-amount-pattern';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

@Component({
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent implements OnInit {
	constructor(
		private readonly _route: ActivatedRoute,
		private readonly _categories: CategoriesService,
		private readonly _wallets: WalletsService,
		private readonly _loading: LoadingService,
		private readonly _transactions: TransactionsService,
		private readonly _router: Router
	) {}

	readonly transactionId = this._route.snapshot.paramMap.get('id');
	readonly isInEditMode = !!this.transactionId;
	readonly moneyAmountPattern = moneyAmountPattern;

	selectedWallet: IWallet;
	formValue: ITransactionFormValue = {
		amount: null,
		type: 'expense',
		date: new Date(),
		category: null,
		wallet: null,
		description: null,
	};
	data$: Observable<{
		categories: ICategory[];
		wallets: IWallet[];
		transaction: ITransaction | null;
	}>;

	ngOnInit() {
		const transaction$: Observable<ITransaction> = this.isInEditMode
			? this._transactions.read(this.transactionId)
			: of(null);

		this.data$ = this._loading.add(
			combineLatest([
				this._categories.readAll(),
				this._wallets.getAll(),
				transaction$,
			]).pipe(
				map(([categories, wallets, transaction]) => ({
					categories,
					wallets,
					transaction,
				})),
				tap(({ transaction }) => {
					if (transaction)
						this.formValue = this._transactionToFormValue(transaction);
				})
			)
		);
	}

	async create() {
		await this._transactions.create(
			Object.assign({}, new TransactionDTO(this.formValue))
		);
		return this._router.navigateByUrl('/');
	}

	async update() {
		await this._transactions.put(
			this.transactionId,
			Object.assign({}, new TransactionDTO(this.formValue))
		);
	}

	async delete() {
		await this._transactions.delete(this.transactionId);
		return this._router.navigateByUrl('/transaction');
	}

	setWallet(wallet: IWallet) {
		this.formValue.wallet = wallet?.id ?? null;
		this.selectedWallet = wallet;
	}

	findWallet(wallets: IWallet[], id: string) {
		return wallets.find(wallet => wallet.id === id);
	}

	get maxAmount(): number | null {
		return this.formValue.type === 'expense'
			? this.selectedWallet?.balance
			: null;
	}

	private _transactionToFormValue(
		transaction: ITransaction
	): ITransactionFormValue {
		return {
			amount: String(transaction.amount),
			type: transaction.type,
			date: transaction.date,
			category: transaction.category,
			wallet: transaction.wallet,
			description: transaction.description,
		};
	}
}

interface ITransactionFormValue {
	amount: string;
	type: TTransactionType;
	date: Date;
	category: string;
	wallet: string;
	description: string;
}

/** Class that converts raw form value into a valid transaction object that can be used in the service. */
class TransactionDTO implements ITransactionBase {
	constructor(formValue: ITransactionFormValue) {
		const { amount, type, date, category, wallet, description } = formValue;

		this.amount = Number(amount);
		this.type = type;
		this.date = date;
		this.category = category;
		this.wallet = wallet;

		// The description field is optional. It should not be present at all if it has nullish value or is an empty string.
		// In case when the user entered a value and then removed it, ngModel assigns an empty string. This is why we check for an empty string.

		!description || Object.assign(this, { description });
	}

	amount: number;
	type: TTransactionType;
	date: Date;
	category: string;
	wallet: string;
}
