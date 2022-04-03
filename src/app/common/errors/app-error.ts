export class AppError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly customData?: any
	) {
		super(message);
	}
}
