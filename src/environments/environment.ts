// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	firestore: {
		apiKey: 'AIzaSyBnAo2tRm1EWhapd1CPK9bC7lQmjYZOyB0',
		authDomain: 'budget-monitor-c013c.firebaseapp.com',
		projectId: 'budget-monitor-c013c',
		storageBucket: 'budget-monitor-c013c.appspot.com',
		messagingSenderId: '996068851259',
		appId: '1:996068851259:web:39e7684497a5c9bb19261e',
	},
	firestoreEmulators: {
		useEmulators: true,
		firestore: ['localhost', 8080],
		auth: ['localhost', 9099],
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
