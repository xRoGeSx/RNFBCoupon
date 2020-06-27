
import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import {ICoupon} from '../Types/ICoupon'
import DetailedCoupon from './DetailedCoupon'
import { IUser } from '../Types/IUser';
import { useDate } from '../Hooks/useDate';

interface Props {
    coupon_info: ICoupon,
    userDocRef: FirebaseFirestoreTypes.DocumentSnapshot | undefined
}


const Coupon : React.FC<Props> = (props) => {
    const [modalVisible, setVisible] = useState(false);
    const [used, setUsed] = useState(props.coupon_info.used)
    const {id,active_time,description_full,description_short,title,valid, reusable_in} = props.coupon_info;

    if(!used)
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
        <DetailedCoupon coupon_info = {props.coupon_info} userDocRef={props.userDocRef} setUsed={setUsed}/>
            </Modal>
        <TouchableOpacity style={styles.coupon_body} onPress={ () => setVisible(true)}> 
            <Text>{title}</Text>
            <Text>{description_short}</Text>
            <Text>Valid untill {valid.toDate().toDateString()}</Text>
            <Text>Reusable in {used} minutes </Text>
        </TouchableOpacity>
        </View>
    )
    return (
        <View style={[styles.coupon_body, {backgroundColor: 'green'}]}> 
            <Text>{title}</Text>
            <Text>{description_short}</Text>
            <Text>Valid untill {valid.toDate().toDateString()}</Text>
            <CountDown dateFrom={used} userDocRef={props.userDocRef} id={id} setUsed={setUsed}/>
        </View>
    )
}

interface CountDownProps {
    id: string,
    dateFrom: number,
    userDocRef: FirebaseFirestoreTypes.DocumentSnapshot | undefined,
    setUsed: Function
}

const CountDown : React.FC<CountDownProps> = (props) => {
    const {userDocRef, id, setUsed} = props;
    const dynamicTime = useDate();
    let distance = props.dateFrom - dynamicTime;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if( seconds < 0) {
        let used_coupons : IUser['used_coupons'] 
        used_coupons = userDocRef?.data()?.used_coupons;
        const result = used_coupons.filter(coupon => coupon.coupon_id != id)
        userDocRef?.ref.set({used_coupons: result}, {mergeFields: ['used_coupons']})

        setUsed(0);
    }
    return (
        <View>
            <Text>Days: {days}</Text>
            <Text>Hours: {hours}</Text>
            <Text>Minutes: {minutes}</Text>
            <Text>Seconds: {seconds}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    coupon_body: {
        borderWidth: 3,
        margin: '2%',
    }
})


export default Coupon