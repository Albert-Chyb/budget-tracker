import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAX_MONEY_AMOUNT_VALUE } from 'src/app/common/constants';
import { isNullish } from 'src/app/common/helpers/isNullish';
import { ICategory } from 'src/app/common/interfaces/category';
import {
	ITransaction,
	ITransactionCreatePayload,
	TTransactionType,
} from 'src/app/common/interfaces/transaction';
import { IWallet } from 'src/app/common/interfaces/wallet';

interface ITransactionFormValue {
	amount: number;
	type: TTransactionType;
	date: Date;
	category: ICategory;
	wallet: IWallet;
	description: string;
}

export class TransactionFormValue implements ITransactionFormValue {
	constructor(private readonly _initialValue?: ITransactionFormValue) {}

	private _category: ICategory = this._initialValue?.category ?? null;

	amount: number = this._initialValue?.amount ?? null;
	type: TTransactionType = this._initialValue?.type ?? null;
	date: Date = this._initialValue?.date ?? new Date();
	wallet: IWallet = this._initialValue?.wallet ?? null;
	description: string = this._initialValue?.description ?? null;

	set category(value: ICategory) {
		this._category = value;
		this.type = value?.defaultTransactionsType;
	}
	get category() {
		return this._category;
	}

	toTransaction(): ITransactionCreatePayload {
		const transaction: ITransactionCreatePayload = {
			amount: this.amount,
			type: this.type,
			date: this.date,
			wallet: this.wallet.id,
			category: this.category.id,
		};

		if (this.description) {
			transaction.description = this.description;
		}

		return transaction;
	}

	static fromTransaction(
		transaction: ITransaction,
		categories: ICategory[],
		wallets: IWallet[]
	) {
		const category = categories.find(
			category => category.id === transaction.category
		);
		const wallet = wallets.find(wallet => wallet.id === transaction.wallet);

		return new TransactionFormValue({
			amount: transaction.amount,
			type: category.defaultTransactionsType,
			date: transaction.date,
			wallet,
			category,
			description: transaction.description,
		});
	}
}

@Component({
	selector: 'transaction-form',
	templateUrl: './transaction-form.component.html',
	styleUrls: ['./transaction-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent {
	@Input('wallets') wallets: IWallet[];
	@Input('categories') categories: ICategory[];

	@Output('onSubmit') onSubmit = new EventEmitter<ITransactionFormValue>();

	@ContentChild(TemplateRef) templateRef: TemplateRef<any>;
	@ViewChild(NgForm, { static: true }) ngForm: NgForm;

	readonly maxDatepickerDate = new Date();
	transaction = new TransactionFormValue();

	compareCategories(category1: ICategory, category2: ICategory): boolean {
		return !isNullish(category1) && !isNullish(category2)
			? category1.id === category2.id
			: category1 === category2;
	}

	compareWallets(wallet1: IWallet, wallet2: IWallet) {
		return !isNullish(wallet1) && !isNullish(wallet2)
			? wallet1.id === wallet2.id
			: wallet1 === wallet2;
	}

	get maxAmount(): number | null {
		const walletBalance: number = this.transaction.wallet?.balance ?? 0;

		return this.transaction.type === 'expense'
			? walletBalance
			: Math.max(MAX_MONEY_AMOUNT_VALUE - walletBalance, 0);
	}
}
