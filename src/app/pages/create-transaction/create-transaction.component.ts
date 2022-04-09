import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionFormValue } from '@components/transaction-form/transaction-form.component';
import { ITransactionCreatePayload } from '@interfaces/transaction';
import { CategoriesService } from '@services/categories/categories.service';
import { LoadingService } from '@services/loading/loading.service';
import { TransactionsService } from '@services/transactions/transactions.service';
import { WalletsService } from '@services/wallets/wallets.service';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
	templateUrl: './create-transaction.component.html',
	styleUrls: ['./create-transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTransactionComponent {
	constructor(
		private readonly _categories: CategoriesService,
		private readonly _wallets: WalletsService,
		private readonly _transactions: TransactionsService,
		private readonly _loading: LoadingService,
		private readonly _router: Router
	) {}

	readonly data$ = combineLatest([
		this._categories.list(),
		this._wallets.list(),
	]).pipe(map(([categories, wallets]) => ({ categories, wallets })));

	createTransaction(transaction: ITransactionCreatePayload) {
		this._loading
			.add(this._transactions.create(transaction).pipe(first()))
			.subscribe(() => this._router.navigateByUrl('/'));
	}

	handleFormSubmit(formValue: TransactionFormValue) {
		this.createTransaction(formValue.toTransaction());
	}
}
