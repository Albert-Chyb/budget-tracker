import { distinctUntilChanged } from 'rxjs/operators';

export function distinctUntilKeysChanged<T>(keys: (keyof T)[]) {
	return distinctUntilChanged<T>((oldObj, currentObj) =>
		keys.every(key => oldObj[key] === currentObj[key])
	);
}
