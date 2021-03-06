
import React,{ useState, useContext } from 'react';
import { StyleSheet, Text, View,  TouchableOpacity, Modal, Image } from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import {ICoupon} from '../Types/ICoupon'
import DetailedCoupon from './DetailedCoupon'

import { useScale } from '../Hooks/useScale';
import Icon from './Icon';
import { GeoPositionContext } from '../context/GeoPositionContext';
import { getDistanceFromLatLonInKm } from '../Functions/getDistance';

interface Props {
    coupon_info: ICoupon,
    userDocRef: FirebaseFirestoreTypes.DocumentSnapshot | undefined
    active: boolean
}


const Coupon : React.FC<Props> = (props) => {
    const [modalVisible, setVisible] = useState(false);
    const scale = useScale()
    const {active, coupon_info} = props;
    const {title,valid,image_url, offer,g, working_hours} = coupon_info;
    const {latitude,longitude} = useContext(GeoPositionContext)

     let _offer = offer.replace(' ', '\n')
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setVisible(false)
            }}
            >
        <DetailedCoupon coupon_info = {props.coupon_info} setVisible={setVisible}/>
            </Modal>
        <TouchableOpacity style={styles.coupon_body} onPress={ () => setVisible(active)}> 
        <View style={{flex: 1, flexDirection: 'row'}}>
            <Image source={{uri : image_url}} resizeMode='cover' style={[{height: scale(100)},styles.image]}/>
            <View style={[styles.coupon_offer,{height: scale(100)}]}>
                <Text adjustsFontSizeToFit={true} numberOfLines={2} style={[{fontSize: scale(11), lineHeight: scale(13)}, styles.coupon_offer_text]}>{_offer}</Text>
                <View style={styles.corner}
                     />
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
        </TouchableOpacity>
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
    }
})


export default Coupon