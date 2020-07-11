import { useState, useEffect, useContext } from "react"
import { ICoupon } from "../Types/ICoupon"
import firestore, { FirebaseFirestoreTypes, firebase } from '@react-native-firebase/firestore'
import geofirex from 'geofirex'
import * as geofirestore from 'geofirestore'
import { step } from "../constants/constants"
import { GeoPositionContext } from "../context/GeoPositionContext"

const geoh = 'u'

const GeoFirestore = geofirestore.initializeApp(firebase.firestore())

const generateCouponFromData = (documentSnaphot: geofirestore.GeoFirestoreTypes.QueryDocumentSnapshot) => {
    const data = documentSnaphot?.data();
    const newCoupon : ICoupon = {
        id: documentSnaphot.id,
        reusable_in: data?.reusable_in,
        active_time: data?.active_time,
        description_full: data?.description_full,
        description_short: data?.description_short,
        title: data?.title,
        valid: data?.valid,
        image_url: data?.image_url,
        offer: data?.offer,
        g: data?.g,
        working_hours: data?.working_hours,
        available_to: data?.available_to,
      }
    return newCoupon;
}

export const useStorage = (granted : boolean) => {
    const[state,setState] = useState(() => {
        console.log('USESTORAGE: ', granted)
        const couponCollection : ICoupon[] = [];
        return {
            initializing_s: true,
            couponCollection,
            loadMore: loadMore
        }
    })

    const loadMore =  async (radius : number, increaseRadius : Function, currentLength : number, geoposition : GeoPositionContext) => {
        const {latitude, longitude} = geoposition
        let queryRange = radius;
        let gotSome = false;
        while(!gotSome) {
            if(queryRange > 10000000) break;
            const result = await GeoFirestore
            .collection('coupons')
            .near({
                center: new firestore.GeoPoint(latitude,longitude),
                radius: queryRange,
            })
            .get();
        if(result.size <= currentLength) { increaseRadius(); queryRange*=2; continue};
             const temp : ICoupon[] = [];
             gotSome=true; 
             result.forEach(documentSnaphot => {
             const newCoupon = generateCouponFromData(documentSnaphot)
             temp.push(newCoupon);
        })
        setState({initializing_s: false, couponCollection: temp, loadMore})
    }
        
    }

    useEffect(() => {
        if(state.initializing_s) {
            console.log('Use Effect')
            const subscriber = GeoFirestore
            .collection('coupons')
            .near({
                center: new firestore.GeoPoint(51.5017,31.3055),
                radius: 1000,
                limit: 0,
            })
            .onSnapshot(querySnapshot => {
                console.log('Storage loaded')
                const temp : ICoupon[] = [];
                querySnapshot.forEach(documentSnaphot => {
                    const newCoupon = generateCouponFromData(documentSnaphot)
                    temp.push(newCoupon);
                })
                setState({initializing_s: false, couponCollection: temp, loadMore})
            })
            return () => subscriber();
        }
    },[])

    return state
}