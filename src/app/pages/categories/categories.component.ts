import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICategory } from 'src/app/common/interfaces/category';

@Component({
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
	categories$: Observable<ICategory[]> = of([
		{
			id: '1',
			name: 'Jedzenie',
			icon: 'https://image.flaticon.com/icons/png/512/2922/2922037.png',
		},
		{
			id: '2',
			name: 'Imprezy',
			icon: 'https://image.flaticon.com/icons/png/512/931/931949.png',
		},
		{
			id: '3',
			name: 'Kosmetyki',
			icon: 'https://image.flaticon.com/icons/png/512/3057/3057396.png',
		},
		{
			id: '4',
			name: 'Codzienne zakupy',
			icon: 'https://image.flaticon.com/icons/png/512/1261/1261126.png',
		},
	]);

	trackById(index: number, category: ICategory) {
		return category.id;
	}
}
