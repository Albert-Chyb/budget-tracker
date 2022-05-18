import { NgModule } from '@angular/core';
import { PaginatedTransactionsTableComponent } from '@components/paginated-transactions-table/paginated-transactions-table.component';
import { TransactionFormComponent } from '@components/transaction-form/transaction-form.component';
import { TransactionsTableComponent } from '@components/transactions-table/transactions-table.component';
import { SharedModule } from '@modules/shared.module';
import { CreateTransactionComponent } from '@pages/create-transaction/create-transaction.component';
import { EditTransactionComponent } from '@pages/edit-transaction/edit-transaction.component';
import { TransactionsComponent } from '@pages/transactions/transactions.component';

@NgModule({
	declarations: [
		TransactionsTableComponent,
		TransactionsComponent,
		PaginatedTransactionsTableComponent,
		TransactionFormComponent,
		CreateTransactionComponent,
		EditTransactionComponent,
	],
	exports: [
		TransactionsTableComponent,
		TransactionsComponent,
		PaginatedTransactionsTableComponent,
		TransactionFormComponent,
		CreateTransactionComponent,
		EditTransactionComponent,
	],
	imports: [SharedModule],
})
export class TransactionsModule {}
