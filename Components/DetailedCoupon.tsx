
import React,{ useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import {ICoupon} from '../Types/ICoupon'
import { IUser } from '../Types/IUser';
import { useScale } from '../Hooks/useScale';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps'
import { getDistanceFromLatLonInKm } from '../Functions/getDistance';
import Icon from './Icon';
import { GeoPositionContext } from '../context/GeoPositionContext';
import CustomHeader from './Header';
import { CollectionContext } from '../context/CollectionContext';
import auth from '@react-native-firebase/auth'
import ActivateCouponButton from './ActivateCouponButton';

interface Props {
    coupon_info: ICoupon,
    setVisible: Function
}

interface State {
    buttonText: string,
    timerValue: number,
    interval: null | number,
}



const usedButtonText = " Coupon used"

const DetailedCoupon : React.FC<Props> = (props : Props) => {
    const {coupon_info, setVisible} = props;
    const {id,image_url,title,offer,working_hours,description_full, g, active_time, valid, reusable_in} = coupon_info;
    const {geopoint} = g;
    const {userData} = useContext(CollectionContext)
    const {latitude,longitude} = useContext(GeoPositionContext)
    const scale = useScale();

    const setCouponUsed = async () => {
        const user = firestore().collection('users').doc(auth().currentUser?.uid)

        let   used_coupons : IUser['used_coupons'];
        const user_data    = await user.get()

        used_coupons = user_data.data()?.used_coupons;
        used_coupons.forEach(coupon => console.log(coupon.coupon_id))
        used_coupons.push({
            coupon_id: id,
            used_at: Date.now(),
            available_at: new Date(Date.now() + (reusable_in * 86400000)).getTime()
        });
        used_coupons.forEach(coupon => console.log(coupon.coupon_id))
        user.set({used_coupons}, {mergeFields: ['used_coupons']})
    }

    const fontSize = (size : number) => {return {fontSize: scale(size)}}

    return (
    <View style={{width: '100%', height: '100%'}}>
        <CustomHeader>
            <TouchableOpacity onPress={() => setVisible(false)} style={{margin: '2%'}} hitSlop={{bottom: scale(30), top: scale(30), left: scale(30), right: scale(30)}}>
                <Icon size={25} source={require('../assets/icons/arrow_back.png')}/>
            </TouchableOpacity>
            <Text style={[styles.header_text, fontSize(12)]}>{title}</Text>
            <Text style={[styles.header_text, fontSize(12)]}/>
        </CustomHeader>
        <View style={[{}, styles.coupon_body]}>
            <Image source={{uri : image_url}} resizeMode='cover' style={[{height: scale(120)},styles.image]}/>
            <Text style={[styles.text_base, fontSize(12)]}>{title}</Text>
            <View style={{width: '90%', height: 2, backgroundColor: 'white', marginLeft: '2%'}}/>
            <Text style={[styles.text_base, fontSize(12)]}>{offer},{working_hours}</Text>
            <Text style={[styles.text_base, fontSize(8)]}>{description_full}</Text>
            <View style={[{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', margin: '2%', marginBottom: '4%', position: 'absolute', bottom: 0}]}>
                <View style={{flex: 1,flexDirection: 'row',}}>
                    <Icon size={20} source={require('../assets/icons/Geo.png')}/>
                    <Text style={[{fontSize: scale(8), lineHeight: scale(9)}, styles.coupon_footer]}>{Math.round(getDistanceFromLatLonInKm(latitude,longitude,g.geopoint.latitude,g.geopoint.longitude)*10*0.621371)/10} Miles Away</Text>
                </View>
                <View style={{flex: 1,flexDirection: 'row',}}>
                    <Icon size={20} source={require('../assets/icons/Time.png')}/>
                    <Text style={[{fontSize: scale(8), lineHeight: scale(9)}, styles.coupon_footer]}>Valid untill {valid.toDate().toDateString()}</Text>
                </View>
            </View>

            <View style={styles.container}>
                <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                latitude: g.geopoint.latitude,
                longitude: g.geopoint.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }} >
                    <Marker coordinate = {{latitude: g.geopoint.latitude,longitude: g.geopoint.longitude}}/>
                    <Marker coordinate = {{latitude: latitude,longitude: longitude}}/>
                    <Polyline coordinates={[
                            {latitude: g.geopoint.latitude,longitude: g.geopoint.longitude},
                            {latitude: latitude,longitude: longitude}
                            ]}
                            strokeWidth={3}
                            strokeColor='red'
                        />
             </MapView>
            </View>
        </View>
        <ActivateCouponButton setCouponUsed={setCouponUsed} active_time={active_time}/>
        
    </View>
    )
}


const styles = StyleSheet.create({
    coupon_body: {
        flex: 10,
        borderRadius: 15,
        margin: '2%',
        backgroundColor: '#465493',

    },
    image: {
         borderRadius: 15,
    },
    text_base: {
        color: 'white',
        margin: '2%',

        fontFamily: 'Roboto'
    },
    container: {
        flex: 0.7,
        width: '100%',
        alignSelf: 'center',
        top: 20,
      },
      map: {
        marginHorizontal: '5%',

        ...StyleSheet.absoluteFillObject,
      },

      coupon_footer: {
        margin: '2%',
        color: '#C4C2C3',

        fontFamily: 'Roboto'
    },
    
    header_text: {
        margin: '2%',
        color: 'white',

        fontWeight: 'bold',
    },
    back_arrow: {
        transform: [{scaleY: 2}]
    }
})


export default DetailedCoupon