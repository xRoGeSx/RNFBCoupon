import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";



export interface IUser {
    email: FirebaseAuthTypes.User['email'],
    acces_type: string,
    geo_position?: FirebaseFirestoreTypes.GeoPoint
    used_coupons: [{
        coupon_id: string,
        used_at: number,
        available_at?: number,
    }],
}