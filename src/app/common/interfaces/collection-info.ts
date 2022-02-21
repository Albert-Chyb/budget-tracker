export interface ICollectionInfo {
	/** Number of documents in the collection. */
	docCount?: number;

	/** Unique documents ids. (Enabled only for some collections) */
	distinct?: string[];
}
