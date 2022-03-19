import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { first, map, switchMap, takeWhile } from 'rxjs/operators';
import { isNullish } from 'src/app/common/helpers/isNullish';
import { ITransactionUpdatePayload } from 'src/app/common/interfaces/transaction';
import { TransactionFormValue } from 'src/app/components/transaction-form/transaction-form.component';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

@Component({
	templateUrl: './edit-transaction.component.html',
	styleUrls: ['./edit-transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTransactionComponent {
	constructor(
		private readonly _route: ActivatedRoute,
		private readonly _transactions: TransactionsService,
		private readonly _wallets: WalletsService,
		private readonly _categories: CategoriesService,
		private readonly _router: Router,
		private readonly _snackBar: MatSnackBar,
		private readonly _loading: LoadingService
	) {}

	readonly data$ = combineLatest([
		this._wallets.list(),
		this._categories.list(),
		this._route.paramMap.pipe(
			switchMap(params => this._transactions.read(params.get('id'))),
			takeWhile(transaction => !isNullish(transaction))
		),
	]).pipe(
		map(([wallets, categories, transaction]) => ({
			wallets,
			categories,
			transaction: TransactionFormValue.fromTransaction(
				transaction,
				categories,
				wallets
			),
		}))
	);

	update(transaction: ITransactionUpdatePayload) {
		this._loading
			.add(
				this._route.paramMap.pipe(
					switchMap(params =>
						this._transactions.update(params.get('id'), transaction)
					),
					first()
				)
			)
			.subscribe(
				() => {
					this._snackBar.open('Pomyślnie zaktualizowano transakcje');
					this._router.navigateByUrl('/');
				},
				() => this._snackBar.open('Nie udało się zaktualizować transakcji')
			);
	}

	delete() {
		this._loading
			.add(
				this._route.paramMap.pipe(
					switchMap(params => this._transactions.delete(params.get('id'))),
					first()
				)
			)
			.subscribe(() => this._router.navigateByUrl('/'));
	}

	handleFormSubmit(formValue: TransactionFormValue) {
		this.update(formValue.toTransaction());
	}
}
