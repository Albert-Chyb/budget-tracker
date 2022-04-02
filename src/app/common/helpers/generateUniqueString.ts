import { collection, doc, getFirestore } from '@angular/fire/firestore';

export const generateUniqueString = () =>
	doc(collection(getFirestore(), 'not-existing-path')).id;
