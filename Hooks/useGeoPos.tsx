import { useState, useEffect } from "react"
import Geolocation from '@react-native-community/geolocation'
import firestore from '@react-native-firebase/firestore'
import { PermissionsAndroid } from "react-native"




export const useGeoPos = () => {
    const [state,setState] = useState(() => {
        return {
            initializing_g: true,
            geo_position: new firestore.GeoPoint(0,0),
            granted: false,
        }
    })

    const askPermission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
        if(granted == PermissionsAndroid.RESULTS.GRANTED) {
        return true
        } else {
        setState({
            geo_position: new firestore.GeoPoint(0, 0),
            initializing_g: false,
            granted: false,
        })     
         }
    }

    useEffect(() => {
        askPermission();
        
        Geolocation.getCurrentPosition(result => {
            console.log("yes geopos")

            setState({
                geo_position: new firestore.GeoPoint(result.coords.latitude, result.coords.longitude),
                initializing_g: false,
                granted: true
            })
        },
        error => {
            console.log("error geopos")
   
        })
        Geolocation.watchPosition(result => {
            setState({
                geo_position: new firestore.GeoPoint(result.coords.latitude, result.coords.longitude),
                initializing_g: false,
                granted: true
            })
        })
        // return () => Geolocation.stopObserving()
    }, [])

    return state
}