import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDmQoRDKdV8F-TheNxX6ebhS70AU7OBRcA',
  authDomain: 'commerce-app-d00b2.firebaseapp.com',
  projectId: 'commerce-app-d00b2',
  storageBucket: 'commerce-app-d00b2.appspot.com',
  messagingSenderId: '505511510440',
  appId: '1:505511510440:web:c12bb5aa656e5d2d9c9d9d',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
