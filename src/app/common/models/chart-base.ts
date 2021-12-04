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
	generateChartDatasets(rawData: T): ChartDataset<C, TChartData>[] {
		const convertedData = this._dataConverters.map(dataset => {
			const chartData: ChartDataset<C, TChartData> = {
				...this.getDatasetConfig(dataset.label),
				data: this._convertLabels(dataset.convert(rawData)),
				label: dataset.label,
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

export abstract class LabelConverter {
	abstract convert(key: string): string;
}

export abstract class DataConverter<T> {
	constructor(public readonly label: string) {}
	abstract convert(data: T): { [label: string]: number };
}
