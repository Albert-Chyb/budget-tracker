import { IClueData } from '@directives/clue-if/clue-if.directive';

export const cluesDatasets: { [prop: string]: IClueData } = {
	noWallets: {
		message: 'Nie posiadasz żadnych portfeli',
		img: 'assets/icons/empty-wallet.svg',
	},
	noCategories: {
		message: 'Nie posiadasz żadnych kategorii.',
		img: 'assets/icons/folder.svg',
	},
	noTransactions: {
		message: 'Nie posiadasz żadnych transakcji',
		img: 'assets/icons/credit-card.svg',
	},
};
