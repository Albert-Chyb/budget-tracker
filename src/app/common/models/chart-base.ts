import { Directive, Input } from '@angular/core';
import { ChartDataset, ChartType } from 'chart.js';

type TChartData = { [unconvertedLabel: string]: number };
type TChartConfig<C extends ChartType> = Omit<
	ChartDataset<C, TChartData>,
	'data' | 'label'
>;

@Directive()
export abstract class Chart<T, C extends ChartType> {
	private readonly _dataConverters: DataConverter<T>[] = [];
	private readonly _datasetConfigs = new Map<string, TChartConfig<C>>();
	private _labelConverter: LabelConverter;

	@Input('data') data: T;

	/** Adds a data converter */
	addDataConverter(...dataset: DataConverter<T>[]) {
		this._dataConverters.push(...dataset);
	}

	/** Removes a dataset */
	removeDataConverter(label: string) {
		const index = this._dataConverters.findIndex(
			dataset => dataset.label === label
		);
		this._dataConverters.splice(index, 1);
	}

	/** Removes all data converters */
	removeAllDataConverters() {
		this._dataConverters.splice(0, this._dataConverters.length);
	}

	/** Replaces the label converter */
	setLabelConverter(newLabelConverter: LabelConverter) {
		this._labelConverter = newLabelConverter;
	}

	/** Generates datasets for the chart */
	generateChartDatasets(): ChartDataset<C, any>[] {
		const convertedData = this._dataConverters.map(dataset => {
			const chartData: ChartDataset<C, TChartData> = {
				...this.getDatasetConfig(dataset.label),
				data: this._convertLabels(dataset.convert(this.data)),
				label: dataset.label,
				parsing: true,
			} as any;

			return chartData;
		});

		return convertedData;
	}

	setDatasetConfig(label: string, config: TChartConfig<C>) {
		this._datasetConfigs.set(label, config);
	}

	removeDatasetConfig(label: string) {
		this._datasetConfigs.delete(label);
	}

	getDatasetConfig(label: string) {
		return this._datasetConfigs.get(label);
	}

	private _convertLabels(chartData: TChartData) {
		return Object.entries(chartData).reduce<TChartData>(
			(data, [key, value]) => {
				const convertedKey = this._labelConverter.convert(key);

				if (convertedKey) {
					data[convertedKey] = value;
				}

				return data;
			},
			{}
		);
	}
}

@Directive()
export abstract class PieChart<T> extends Chart<T, 'pie'> {
	generateChartDatasets(): ChartDataset<'pie', number[]>[] {
		const chartDatasets = super.generateChartDatasets();

		return chartDatasets.map(dataset => {
			dataset.data = Object.values(dataset.data);
			return dataset;
		});
	}

	generateLabels(): string[] {
		const chartDatasets = super.generateChartDatasets();

		return Object.keys(chartDatasets[0].data);
	}
}

export abstract class LabelConverter {
	abstract convert(key: string): string;
}

export abstract class DataConverter<T> {
	constructor(public readonly label: string) {}
	abstract convert(data: T): TChartData;
}
