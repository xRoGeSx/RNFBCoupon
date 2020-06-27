import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";



export interface IUser {
    email: FirebaseAuthTypes.User['email'],
    acces_type: string,
    used_coupons: [{
        coupon_id: string,
        used_at: number,
        available_at?: number,
    }]
}