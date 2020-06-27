
import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Alert, Button } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import {ICoupon} from '../Types/ICoupon'
import { IUser } from '../Types/IUser';

interface Props {
    coupon_info: ICoupon,
    userDocRef: FirebaseFirestoreTypes.DocumentSnapshot | undefined,
    setUsed: Function
}

interface State {
    buttonText: string,
    timerValue: number,
    interval: null | number,
}



const usedButtonText = " Coupon used"

class DetailedCoupon extends React.Component<Props,State> {
    
    constructor(props : Props) {
        super(props);
        this.state = {
            buttonText: 'Use coupon',
            timerValue: 30,
            interval: null,
        };
    }

    setCouponUsed() {
        // this.props.userDocRef?.ref.set({
        //     used_coupons: [
        //         {
        //             coupon_id: this.props.coupon_info.id,
        //             used_at: Date.now(),
        //             available_at: new Date(Date.now() + (this.props.coupon_info.reusable_in * 86400000)).getTime()
        //         }
        //     ]
        // }, {
        //     mergeFields: ['used_coupons']
        // })
        let used_coupons : IUser['used_coupons'];
        used_coupons = this.props.userDocRef?.data()?.used_coupons;
        used_coupons.push({
            coupon_id: this.props.coupon_info.id,
            used_at: Date.now(),
            available_at: new Date(Date.now() + (this.props.coupon_info.reusable_in * 86400000)).getTime()
        });
        this.props.userDocRef?.ref.set({used_coupons}, {mergeFields: ['used_coupons']})
    }

    componentDidMount(){
        this.runTimer = this.runTimer.bind(this)
    }

    componentWillUnmount() {
        if(this.state.interval)
        clearInterval(this.state.interval)
    }

    runTimer = (setState : Function) => {
        let interval: number;
        this.setCouponUsed();
            interval = setInterval(() => {
                if(this.state.timerValue)
                {
                this.setState({timerValue: this.state.timerValue-1})
                this.setState({buttonText: this.state.timerValue + usedButtonText})
                } else {
                this.setState({buttonText: "Coupon expired"})
                clearInterval(interval);
                this.props.setUsed(new Date(Date.now() + (this.props.coupon_info.reusable_in * 86400000)).getTime())
                }
            }, 250)
            this.setState({interval : interval})
    }

    render() {
        const {id,active_time,description_full,description_short,title,valid} = this.props.coupon_info;
        const {buttonText, timerValue} = this.state;
        return(
        <View>
        <TouchableOpacity style={styles.coupon_body}> 
            <Text>{title}</Text>
            <Text>{description_short}</Text>
            <Text>Valid untill {valid.toDate().toDateString()}</Text>
            <Button title={buttonText} onPress={() => this.runTimer(this.setState.bind(this))}/>
        </TouchableOpacity>
        </View> 
        )
    }
}


const styles = StyleSheet.create({
    coupon_body: {
        borderWidth: 3,
        margin: '2%',
        backgroundColor: 'red',
    }
})


export default DetailedCoupon