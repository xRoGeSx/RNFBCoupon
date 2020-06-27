import React,{ useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin'
import firestore, { FirebaseFirestoreTypes, firebase } from '@react-native-firebase/firestore'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import {ICoupon} from './Types/ICoupon'
import Coupon from './Components/Coupon'
import {IUser} from './Types/IUser'
import {useAuth} from './Hooks/useAuth'
import WelcomeScreen from './Views/WelcomeScreen'
import CouponList from './Views/CouponList';

GoogleSignin.configure({
  
  // Needs to be encapsulated into .env file
})


const SignOut = () => (
  <Button
    title="Sign out"
    onPress= { () => {
      auth().signOut()
    }}
  />
)

interface State {
  initializing: boolean,
  user: FirebaseAuthTypes.User | null,
}




const App : React.FC = () => {

const {initializing, user} = useAuth();

if(initializing) return <View/>;
if(!user)        return <WelcomeScreen/> 
                 return <CouponList/>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App