export const environment = {
	production: true,
	firestore: {
		apiKey: 'AIzaSyBnAo2tRm1EWhapd1CPK9bC7lQmjYZOyB0',
		authDomain: 'budget-monitor-c013c.firebaseapp.com',
		projectId: 'budget-monitor-c013c',
		storageBucket: 'budget-monitor-c013c.appspot.com',
		messagingSenderId: '996068851259',
		appId: '1:996068851259:web:39e7684497a5c9bb19261e',
	},
	firestoreEmulators: {
		useEmulators: false,
		firestore: ['localhost', 8080],
		auth: ['localhost', 9099],
		storage: ['localhost', 9199],
		functions: ['localhost', 5001],
	},
};
