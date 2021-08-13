import { first } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';

/**
 * Holds initialization of the app until user data is read from the database.
 *
 * @param user User service
 */
export function initializeUser(user: UserService) {
	return () => user.user$.pipe(first());
}
