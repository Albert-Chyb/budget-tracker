import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ITransactionCreatePayload } from 'src/app/common/interfaces/transaction';
import { TransactionFormValue } from 'src/app/components/transaction-form/transaction-form.component';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

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
