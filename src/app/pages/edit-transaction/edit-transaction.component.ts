import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError } from '@common/errors/app-error';
import { ErrorCode } from '@common/errors/error-code';
import { TransactionFormValue } from '@components/transaction-form/transaction-form.component';
import { isNullish } from '@helpers/isNullish';
import { ITransactionUpdatePayload } from '@interfaces/transaction';
import { CategoriesService } from '@services/categories/categories.service';
import { ErrorsService } from '@services/errors/errors.service';
import { LoadingService } from '@services/loading/loading.service';
import { TransactionsService } from '@services/transactions/transactions.service';
import { WalletsService } from '@services/wallets/wallets.service';
import { combineLatest, of, throwError } from 'rxjs';
import { catchError, first, map, switchMap, takeWhile } from 'rxjs/operators';

const TRANSACTION_NOT_FOUND_ERROR = new AppError(
	'Transaction does not exist.',
	ErrorCode.TransactionNotFound,
	`This error was thrown in the edit-transaction page. It is thrown when the id in the 
		route params points to a non-existing transaction.`
);

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
		private readonly _loading: LoadingService,
		private readonly _errors: ErrorsService
	) {}

	readonly data$ = combineLatest([
		this._wallets.list(),
		this._categories.list(),
		this._route.paramMap.pipe(
			map(params => params.get('id')),
			switchMap(transactionId =>
				this._transactions
					.exists(transactionId)
					.pipe(
						switchMap(exists =>
							exists
								? this._transactions.read(transactionId)
								: throwError(TRANSACTION_NOT_FOUND_ERROR)
						)
					)
			),
			catchError(error => {
				this._handleError(error);
				return of(null);
			}),
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
					this._snackBar.open('Pomyślnie zaktualizowano transakcje.');
					this._router.navigateByUrl('/');
				},
				() => this._errors.show('Nie udało się zaktualizować transakcji.')
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
			.subscribe(
				() => {
					this._router.navigateByUrl('/');
					this._snackBar.open('Usunięto transakcje.');
				},
				() => {
					this._errors.show('Nie udało się usunąć transakcji');
				}
			);
	}

	handleFormSubmit(formValue: TransactionFormValue) {
		this.update(formValue.toTransaction());
	}

	private _handleError(error: any) {
		if (
			error instanceof AppError &&
			error.code === ErrorCode.TransactionNotFound
		) {
			this._errors.show('Próbowano edytować nieistniejącą transakcje.');
			this._router.navigateByUrl('/transactions');
		} else {
			throw error;
		}
	}
}
