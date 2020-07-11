import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'


export interface ICoupon {
    id: string,
    reusable_in: number,   
    // Amount of hours it takes for this coupon to be used again                 
    active_time: number,
    // Amount of seconds * 10 the coupon stays active
    description_full: string,
    description_short: string,
    // speaks for itself
    image_url: string,
    // url to the image that's going to be shown
    title: string,
    // Title of coupon that shows below the image
    working_hours: string,
    // Shown below the title
    offer: string,
    // The offer that is shown on the right
    valid: FirebaseFirestoreTypes.Timestamp,
    // Expiration date of the coupon
    g: {
      geohash: string,
      geopoint: FirebaseFirestoreTypes.GeoPoint
    }
    // Latitude and longitude of coupon's place
    available_to: [string]
    // categories of users this coupon is available to

    used?: number

  }