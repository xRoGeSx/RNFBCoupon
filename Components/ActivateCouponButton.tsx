import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useScale } from '../Hooks/useScale';
import { useState } from 'react';
import Icon from './Icon';
import { CollectionContext } from '../context/CollectionContext';

interface ActivateCouponButtonProps {
    setCouponUsed : Function
    active_time    : number
}

interface ButtonState {
    setButtonState : (number : 1|2|3) => void
    scale : Function
    active_time : number
}

const ButtonStateOne : React.FC<ButtonState> = (props : ButtonState) => {
    const fontSize = (size : number) => {return {fontSize: scale(size)}}
    const {scale, setButtonState, active_time} = props;
       return (
         <TouchableOpacity onPress={() => setButtonState(2)} style={[styles.redeem_button, {height: scale(100)}]}>
          <Text style={[fontSize(16),{lineHeight: scale(19)},styles.redeem_button_text, {fontWeight: 'bold'}]}>ACTIVATE COUPON </Text>
          <Text style={[fontSize(10),{lineHeight: scale(11)},styles.redeem_button_text]}>{`Will be active for ${active_time} minutes`}</Text>
        </TouchableOpacity> 
  );
}

const ButtonStateTwo : React.FC<ButtonState> = (props : ButtonState) => {
    const fontSize = (size : number) => {return {fontSize: scale(size)}}
    const {scale, setButtonState, active_time} = props;
    return (
        <View style={[styles.redeem_button_2, {height: scale(100)}]}>
            <TouchableOpacity style={styles.redeem_button_2_subbutton} onPress={() => setButtonState(1)}>
                <Text style={styles.redeem_button_2_subbutton_text}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.redeem_button_2_subbutton} onPress={() => setButtonState(3)}>
                <Text style={styles.redeem_button_2_subbutton_text}>ACTIVATE</Text>
            </TouchableOpacity>
        </View> 
    )
}
const prettify = (number : number) => {
    if(number.toString().length > 1) return number;
    return `0${number}`
}

const useCountdown = (countdown_point : number) => {
    const [state,setState] = useState(countdown_point)
    const decrement = () => setState(state-1)
    useEffect(() =>{
        if(state > -1) {
        const timeout = setTimeout(decrement, 1000)
        return () => clearTimeout(timeout)
    }
    }, [state])
    return state
}

interface ButtonThree extends ButtonState {
    setCouponUsed : Function
}

const ButtonStateThree : React.FC<ButtonThree> = (props : ButtonThree) => {
    const fontSize = (size : number) => {return {fontSize: scale(size)}}
    const {scale, setButtonState, active_time, setCouponUsed} = props;
    const {userData} = React.useContext(CollectionContext)
    const seconds = useCountdown(active_time * 60);

    if(seconds <= 0) {
        setCouponUsed();
    }
    return (
        <View style={[styles.redeem_button_3, {height: scale(100)}]}>
            <View style={{flexDirection: 'column', flex: 1}}>
                <View style={[{margin: '8%', marginHorizontal: '15%'}]}>
                     <Icon size={35} source={require('../assets/icons/Check.png')}/>
                </View>
                <View style={[{flexDirection: 'row', marginHorizontal: '15%'}]}>
                    <Icon size={20} source={require('../assets/icons/Time.png')}/>
                    <Text style={[{fontSize: scale(9)}, styles.redeem_button_3_text]}>{prettify(Math.floor(seconds/60))}:{prettify(seconds%60)}</Text>
                </View>
                <View style={[{flexDirection: 'row', marginHorizontal: '15%'}]}>
                    <Icon size={20} source={require('../assets/icons/Account.png')}/>
                    <Text style={[{fontSize: scale(9)}, styles.redeem_button_3_text]}>{userData?.acces_type}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'column', flex: 2}}>
            <Text style={[styles.right_bar_header, {fontSize: scale(14)}]}>COUPON ACTIVE</Text>
            <Text style={[styles.right_bar_body, {fontSize: scale(9)}]}>Please show this to the service provider before the time runs out</Text>
            </View>
        </View> 
    )
}

const ActivateCouponButton : React.FC<ActivateCouponButtonProps> = (props: ActivateCouponButtonProps) => {

  const {setCouponUsed, active_time} = props;
  const [buttonState, setButtonState] = useState<1 | 2 | 3>(1)
  const scale = useScale();

  if(buttonState == 1) return <ButtonStateOne   setButtonState={setButtonState} active_time={active_time} scale={scale}/>
  if(buttonState == 2) return <ButtonStateTwo   setButtonState={setButtonState} active_time={active_time} scale={scale}/>
  if(buttonState == 3) return <ButtonStateThree setButtonState={setButtonState} active_time={active_time} scale={scale} setCouponUsed={setCouponUsed}/>
  return <View/>


};

export default ActivateCouponButton;

const styles = StyleSheet.create({
    redeem_button: {
        width: '80%',

        margin: '2%',

        borderBottomWidth: 14,
        borderBottomColor: '#F27A4C',


        alignSelf: 'center',
        justifyContent: 'center',

        backgroundColor: '#F1592B',
      },
      redeem_button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',



        color: 'white'
      },
      redeem_button_2: {
        flexDirection: 'row',
        width: '80%',

        margin: '2%',

        borderBottomWidth: 14,
        borderBottomColor: '#F27A4C',


        alignSelf: 'center',
        justifyContent: 'space-evenly',

        backgroundColor: '#F1592B',
      },

      redeem_button_2_subbutton: {
        alignSelf: 'center',

        backgroundColor: '#F27A4C'
      },
      redeem_button_2_subbutton_text: {
        color: 'white',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        padding: '3%',
        paddingHorizontal: '5%',
      },
      redeem_button_3: {
        flexDirection: 'row',
        width: '80%',

        margin: '2%',

        borderBottomWidth: 14,
        borderBottomColor: 'rgba(51,165,50,0.71)',


        alignSelf: 'center',
        justifyContent: 'space-evenly',

        backgroundColor: '#33A532',
      },
      
      redeem_button_3_text: {
          color: 'white',
          marginHorizontal: '5%'
      },
      right_bar_body: {
        color: 'white',
        textAlign: 'center',
        marginVertical: '8%',

      },
      right_bar_header: {
        color: 'white',
        textAlign: 'center',
        marginTop: '6%',

      },
      

});
