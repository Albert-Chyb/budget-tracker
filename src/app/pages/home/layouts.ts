import { TPeriodBarChartLayoutName } from '@components/period-bar-chart/period-bar-chart.component';

interface ILayoutConfig {
	card: {
		colspan: number;
	};
	expensesChart: {
		colspan: number;
		chartLayoutName: TPeriodBarChartLayoutName;
	};
	popularCategoriesChart: {
		colspan: number;
	};
	transactionsTable: {
		colspan: number;
	};
}

export const xSmallLayout: ILayoutConfig = {
	card: {
		colspan: 12,
	},
	expensesChart: {
		colspan: 12,
		chartLayoutName: 'compact',
	},
	popularCategoriesChart: {
		colspan: 12,
	},
	transactionsTable: {
		colspan: 12,
	},
};

export const smallLayout: ILayoutConfig = {
	card: {
		colspan: 6,
	},
	expensesChart: {
		colspan: 12,
		chartLayoutName: 'compact',
	},
	popularCategoriesChart: {
		colspan: 12,
	},
	transactionsTable: {
		colspan: 12,
	},
};

export const mediumLayout: ILayoutConfig = {
	card: {
		colspan: 6,
	},
	expensesChart: {
		colspan: 12,
		chartLayoutName: 'full',
	},
	popularCategoriesChart: {
		colspan: 12,
	},
	transactionsTable: {
		colspan: 12,
	},
};

export const largeLayout: ILayoutConfig = {
	card: {
		colspan: 3,
	},
	expensesChart: {
		colspan: 12,
		chartLayoutName: 'full',
	},
	popularCategoriesChart: {
		colspan: 5,
	},
	transactionsTable: {
		colspan: 7,
	},
};
