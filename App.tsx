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
import { useGeoPos } from './Hooks/useGeoPos';
import { GeoPositionContext } from './context/GeoPositionContext';
import { CollectionContext } from './context/CollectionContext';

import { useStorage } from './Hooks/useStorage';
import { useUserData } from './Hooks/useUserData';
import { step, initial_search_radius } from './constants/constants';

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

const [radius, setRadius] = useState(1000);
const increaseRadius = () => {
  setRadius(radius*1.5) 
  return radius;
}

const {initializing, user} = useAuth();
const {initializing_g,geo_position, granted} = useGeoPos();
const {initializing_s, couponCollection, loadMore} = useStorage(granted);
const {initializing_ud, userData} = useUserData(user?.uid)


if(initializing && initializing_g && initializing_s && initializing_ud) return <View/>;
if(!user)        return <WelcomeScreen/> 
                 return <CollectionContext.Provider value={{
                   collectionData        : couponCollection,
                   userData              : userData,
                   loadMore              : loadMore,
                   increaseRadius        : increaseRadius
                 }}>
                         <GeoPositionContext.Provider value={{latitude: geo_position.latitude, longitude: geo_position.longitude}}>
                          <CouponList/>
                         </GeoPositionContext.Provider>
                        </CollectionContext.Provider>
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