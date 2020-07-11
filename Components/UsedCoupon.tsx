
import React,{ useState, useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import {ICoupon} from '../Types/ICoupon'
import { IUser } from '../Types/IUser';
import { useDate } from '../Hooks/useDate';
import { useScale } from '../Hooks/useScale';
import Icon from './Icon';
import { GeoPositionContext } from '../context/GeoPositionContext';
import { getDistanceFromLatLonInKm } from '../Functions/getDistance';
import { CollectionContext } from '../context/CollectionContext';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

interface Props {
    coupon_info: ICoupon,
    userDocRef: FirebaseFirestoreTypes.DocumentSnapshot | undefined
    active: boolean
}


const UsedCoupon : React.FC<Props> = (props) => {
    const [modalVisible, setVisible] = useState(false);
    const scale = useScale()
    const {active, coupon_info} = props;
    const [used, setUsed] = useState(coupon_info.used)
    const {id,description_short,title,valid,image_url, offer,g, working_hours} = coupon_info;
    const {latitude,longitude} = useContext(GeoPositionContext)

     let _offer = offer.replace(' ', '\n')
    return (
        <View>
        <View style={styles.coupon_body}> 
        <View style={{flex: 1, flexDirection: 'row'}}>
            <Image source={{uri : image_url}} resizeMode='cover' style={[{height: scale(100)},styles.image]}/>
            <View style={[styles.coupon_offer,{height: scale(100)}]}>
                <Text adjustsFontSizeToFit={true} numberOfLines={2} style={[{fontSize: scale(11), lineHeight: scale(13)}, styles.coupon_offer_text]}>{_offer}</Text>
                <View style={styles.corner}/>
            </View>
        </View>
            <Text style={[{fontSize: scale(12), lineHeight: scale(14), marginTop: '2%'}, styles.coupon_header]}>{title}</Text>
        <Text style={[{fontSize: scale(8), lineHeight: scale(9)}, styles.coupon_header]}>{working_hours}</Text>
            <View style={[{flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: '2%', marginBottom: '4%'}]}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                 <Icon size={20} source={require('../assets/icons/Geo.png')}/>
        <Text style={[{fontSize: scale(8), lineHeight: scale(9)}, styles.coupon_footer]}>
            {Math.round(getDistanceFromLatLonInKm(
                latitude,
                longitude,
                g.geopoint.latitude,
                g.geopoint.longitude)*10*0.621371)/10} Miles Away
            </Text>
            </View>
            <View style={{flex: 1,flexDirection: 'row'}}>
                <Icon size={20} source={require('../assets/icons/Time.png')}/>
                <Text style={[{fontSize: scale(8), lineHeight: scale(9)}, styles.coupon_footer]}>Valid untill {valid.toDate().toDateString()}</Text>
            </View>
            </View>
        </View>
        <View style={styles.used_overlay}/>
        <CountDown coupon_id={id}/>

        </View>
    )
}

interface CountDownProps {
    coupon_id: string,
}

const prettify = (number : number) => {
    if(number.toString().length > 1) return number;
    return `0${number}`
}

const CountDown : React.FC<CountDownProps> = (props) => {
    const {coupon_id} = props;
    const  {userData} = useContext(CollectionContext)
    const scale = useScale()
    const dynamicTime = useDate();

    const font_size = 40;

    const used_coupon  = userData?.used_coupons.find(coupon => coupon.coupon_id == coupon_id)
    const available_at = used_coupon?.available_at

    let distance = available_at - dynamicTime;
        var days = prettify(Math.floor(distance / (1000 * 60 * 60 * 24)));
        var hours = prettify(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        var minutes = prettify(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        var seconds = prettify(Math.floor((distance % (1000 * 60)) / 1000));
    if( seconds < 0) {
        let used_coupons : IUser['used_coupons'] | undefined
        used_coupons = userData?.used_coupons;
        const result = used_coupons?.filter(coupon => coupon.coupon_id != coupon_id)
        firestore().collection('users').doc(auth()?.currentUser?.uid).set({used_coupons: result}, {mergeFields: ['used_coupons']})
    }
    return (
        <View style={styles.countdown_body}>
            <Text style={[styles.countdown_text, {fontSize: scale(font_size)}]}>{days}:</Text>
            <Text style={[styles.countdown_text, {fontSize: scale(font_size)}]}>{hours}:</Text>
            <Text style={[styles.countdown_text, {fontSize: scale(font_size)}]}>{minutes}:</Text>
            <Text style={[styles.countdown_text, {fontSize: scale(font_size)}]}>{seconds}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    coupon_body: {
        margin: '2%',
        backgroundColor: 'white',

        borderRadius: 15,

    },
    coupon_header: {
        marginLeft: '2%',
        color: '#000000',

        fontFamily: 'Roboto'
    },
    image: {
        flex: 3,
         borderRadius: 15,
    },
    coupon_offer: {
      flex: 1 ,
      padding: '3%',
      marginLeft: '1%',

      backgroundColor: '#F1592B',
    },
    corner: {
        position: 'absolute',
        bottom: '-58%',
        right: '5%',
        width: '72%', 
        height: '140%',
        alignSelf: 'center',
        backgroundColor: 'white',
         transform: [{rotate: '60deg'}]},
    coupon_offer_text: {
        textAlignVertical: 'top',
        textAlign: "left",

        color: '#FFFFFF',

        fontFamily: 'Roboto',
        fontWeight: 'bold'
    },
    coupon_footer: {
        margin: '2%',
        color: '#C4C2C3',

        fontFamily: 'Roboto'
    },
    used_overlay: {
        position: 'absolute',
        width: '100%',
        height: '95%',
        margin: '2%',
        left: -7,
        bottom: -3,
        borderRadius: 15,
        
        backgroundColor: 'rgba(52,52,52,0.5)'
      },
    countdown_body: {
        position: 'absolute',
        flexDirection: 'row',

        alignSelf: 'center',
        top: '30%',
    },
    countdown_text: {
        color: '#F1592B',

        fontWeight: 'bold',
    }
})


export default UsedCoupon