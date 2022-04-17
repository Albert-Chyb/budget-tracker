export enum ErrorCode {
	/** Client requested a non-existing transaction. */
	TransactionNotFound = 'transaction-not-found',

	/** Client requested a non-existing object in the database */
	DatabaseObjectNotFound = 'db-object-not-found',
}
