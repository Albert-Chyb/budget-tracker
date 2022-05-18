import { ModuleWithProviders, NgModule } from '@angular/core';
import { ClueComponent } from '@components/clue/clue.component';
import {
	ClueIfDirective,
	CLUES_DATASETS,
	TCluesDatasets,
} from '@directives/clue-if/clue-if.directive';

@NgModule({
	declarations: [ClueComponent, ClueIfDirective],
	exports: [ClueComponent, ClueIfDirective],
})
export class CluesModule {
	static datasets(datasets: TCluesDatasets): ModuleWithProviders<CluesModule> {
		return {
			ngModule: CluesModule,
			providers: [
				{
					provide: CLUES_DATASETS,
					useValue: datasets,
				},
			],
		};
	}
}
