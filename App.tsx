import React,{ useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import firestore, { FirebaseFirestoreTypes, firebase } from '@react-native-firebase/firestore'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import {ICoupon} from './Types/ICoupon'
import Coupon from './Components/Coupon'
import {IUser} from './Types/IUser'
import {useAuth} from './Hooks/useAuth'
import WelcomeScreen from './Views/WelcomeScreen'
import CouponList from './Views/CouponList';

GoogleSignin.configure({
  webClientId: '881842366351-qjhprb56e8re8fen7o0j7trenvi7s9ff.apps.googleusercontent.com'
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

const Drawer = createDrawerNavigator();


const App : React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={MainView} />
        <Drawer.Screen name="Redeem Code" component={RedeemCode}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


const RedeemCode : React.FC = () => {
  return (
    <View></View>
  )
}

const MainView : React.FC = () => {

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