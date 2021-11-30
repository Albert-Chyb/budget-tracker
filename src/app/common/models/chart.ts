export abstract class ChartLabelConverter<T> {
	abstract convert(index: number, data: T): string;
}

export abstract class ChartDataset<T> {
	constructor(private readonly _data: T, public readonly label: string) {}

	abstract getDataAt(index: number): number;
	abstract length: number;

	get data() {
		return this._data;
	}
}

export abstract class Chart<T> {
	constructor(
		private _dataset: ChartDataset<T> = new EmptyChartDataset(),
		private _labelConverter: ChartLabelConverter<T> = new ChartNoLabelConverter()
	) {}

	generateChartData(): number[] {
		const data = [];

		for (let i = 0; i < this._dataset.length; i++) {
			data[i] = this._dataset.getDataAt(i);
		}

		return data;
	}

	generateLabels(): string[] {
		const labels = [];

		for (let i = 0; i < this._dataset.length; i++) {
			labels[i] = this._labelConverter.convert(i, this._dataset.data);
		}

		return labels;
	}

	changeDataset(newDataset: ChartDataset<T>): void {
		this._dataset = newDataset;
	}

	changeLabels(converter: ChartLabelConverter<T>): void {
		this._labelConverter = converter;
	}

	get dataset() {
		return this._dataset;
	}

	get labelConverter() {
		return this._labelConverter;
	}
}

export class EmptyChartDataset extends ChartDataset<any> {
	constructor() {
		super({}, '');
	}

	getDataAt(index: number) {
		return 0;
	}

	length: number = 0;
}

export class ChartNoLabelConverter extends ChartLabelConverter<any> {
	convert(index: number): string {
		return '';
	}
}
