import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
	connectFirestoreEmulator,
	getFirestore,
	provideFirestore,
} from '@angular/fire/firestore';
import {
	connectFunctionsEmulator,
	getFunctions,
	provideFunctions,
} from '@angular/fire/functions';
import {
	connectStorageEmulator,
	getStorage,
	provideStorage,
} from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

@NgModule({
	imports: [
		provideFirebaseApp(() => initializeApp(environment.firestore)),
		provideAuth(() => {
			const auth = getAuth();

			if (environment.firestoreEmulators.useEmulators) {
				const [host, port] = environment.firestoreEmulators.auth;

				connectAuthEmulator(auth, `http://${host}:${port}`);
			}

			return auth;
		}),
		provideFirestore(() => {
			const firestore = getFirestore();

			if (environment.firestoreEmulators.useEmulators) {
				const [host, port] = environment.firestoreEmulators.firestore;

				connectFirestoreEmulator(firestore, <string>host, <number>port);
			}

			return firestore;
		}),
		provideStorage(() => {
			const storage = getStorage();

			if (environment.firestoreEmulators.useEmulators) {
				const [host, port] = environment.firestoreEmulators.storage;

				connectStorageEmulator(storage, <string>host, <number>port);
			}

			return storage;
		}),
		provideFunctions(() => {
			const functions = getFunctions();

			if (environment.firestoreEmulators.useEmulators) {
				const [host, port] = environment.firestoreEmulators.functions;

				connectFunctionsEmulator(functions, <string>host, <number>port);
			}

			return functions;
		}),
	],
})
export class FirebaseModule {}
