// app/config/providers.ts

import { FirebaseAuthAdapter } from '@/adapters/auth/firebase.auth.adapter'
import { IAuthProvider } from '@/interfaces/auth.provider'
// import { FirestoreAdapter } from '@/adapters/firestore.adapter'
// import { IDataProvider } from '@/interfaces/data.interface';

export const getAuthProvider = (): IAuthProvider => {
  return new FirebaseAuthAdapter()
}

// export const getDataProvider = <T>(): IDataProvider<T> => {
//   return new FirestoreAdapter<T>()
// }
