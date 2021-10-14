import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Pipe({
	name: 'loading',
})
export class LoadingPipe implements PipeTransform {
	constructor(private readonly _loading: LoadingService) {}

	transform<T>(task: Observable<T>, ...args: unknown[]): Observable<T>;
	transform<T>(task: Promise<T>, ...args: unknown[]): Promise<T>;
	transform<T>(task: any, ...args: unknown[]): any {
		return this._loading.add(task);
	}
}
