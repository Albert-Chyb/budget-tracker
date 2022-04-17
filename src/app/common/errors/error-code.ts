export enum ErrorCode {
	/** Client requested a non-existing transaction. */
	TransactionNotFound = 'transaction-not-found',

	/** Client requested a non-existing object in the database */
	DatabaseObjectNotFound = 'db-object-not-found',

	/** The operation on the given wallet failed, because the it is referenced by at least one transaction. */
	WalletReferenced = 'wallet-referenced',

	/** The operation on the given category failed, because the it is referenced by at least one transaction. */
	CategoryReferenced = 'category-referenced',
}
