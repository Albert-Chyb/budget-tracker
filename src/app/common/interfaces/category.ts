/**
 * Represents object that is returned from a service.
 */
export interface ICategory {
	id: string;
	name: string;
	icon: string;
	iconPath: string;
}

/**
 * Represents object that is stored in the database.
 */
export interface ICategoryBase {
	name: string;
	icon: string;
	iconPath: string;
}
