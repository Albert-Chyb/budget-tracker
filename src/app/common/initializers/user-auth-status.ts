import { UserService } from '@services/user/user.service';
import { first } from 'rxjs/operators';

/**
 * Holds initialization of the app until user data is read from the database.
 *
 * @param user User service
 */
export function initializeUser(user: UserService) {
	return () => user.user$.pipe(first());
}
