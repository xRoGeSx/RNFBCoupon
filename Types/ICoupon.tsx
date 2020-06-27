import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'


export interface ICoupon {
    id: string,
    reusable_in: number,
    active_time: number,
    description_full: string,
    description_short: string,
    title: string,
    valid: FirebaseFirestoreTypes.Timestamp,
    used?: number
  }