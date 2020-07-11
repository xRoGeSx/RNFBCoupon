import React,{ useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import {ICoupon} from '../Types/ICoupon'
import Coupon from '../Components/Coupon'
import {IUser} from '../Types/IUser'
import { GeoPositionContext } from '../context/GeoPositionContext';
import Header from '../Components/Header'
import Icon from '../Components/Icon';
import { useScale } from '../Hooks/useScale';
import { getDistanceFromLatLonInKm } from '../Functions/getDistance';
import { CollectionContext } from '../context/CollectionContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UsedCoupon from '../Components/UsedCoupon';


const SignOut = () => (
  <Button
    title="Sign out"
    onPress= { () => {
      auth().signOut()
    }}
  />
)

interface CouponListProps {
}



const CouponList : React.FC<CouponListProps> = (props : CouponListProps) => {
  const [userDocRef, setUserDocRef] = useState<FirebaseFirestoreTypes.DocumentSnapshot>();
  const [isLoaded, setLoaded] = useState(false)
  const {collectionData,userData, loadMore, increaseRadius} = useContext(CollectionContext)
  const scale = useScale()
  let temp : ICoupon[];

  const geoposition = useContext(GeoPositionContext)
  const {latitude,longitude} = geoposition;

  const checkForUsed = (document_id : string, uData : IUser | undefined) => {
    let used_coupons = uData?.used_coupons;
    const result = used_coupons?.filter( used_coupon => used_coupon.coupon_id == document_id);
    return result?.length
  }

  const collection_ =collectionData.sort((a,b) => {
    const distA = getDistanceFromLatLonInKm(
      a.g.geopoint.latitude,
      a.g.geopoint.longitude,
      latitude,
      longitude
      )
    const distB = getDistanceFromLatLonInKm(
      b.g.geopoint.latitude,
      b.g.geopoint.longitude,
      latitude,
      longitude
        )
      return distA - distB
  })


  return(
    <View style={{flex: 1}}>
      <Header> 
        <View style={styles.menu_item} >
          <Icon size={25} source={require('../assets/icons/Menu.png')}/>
        </View>
        <Text style={[styles.menu_item,{fontSize: scale(12), lineHeight: scale(14), color: 'white', fontFamily: 'Roboto', fontWeight: 'bold'}]}>YOUR OFFERS</Text>
        <View style={styles.menu_item} >
          <Icon size={25} source={require('../assets/icons/Search.png')}/>
        </View>
      </Header>
      <View style={{flex: 10,}}>
      <FlatList data={collection_} renderItem={({item}) => {
        //if(!checkForUsed(item.id, userData))
        if(!item.available_to.find(at => at == userData?.a))
        if(!checkForUsed(item.id, userData))
        return (
          <Coupon coupon_info = {item} userDocRef={userDocRef} active={true}/>
        )
        return (
          <UsedCoupon coupon_info = {item} userDocRef={userDocRef} active={true}/>
        )
      }}
        onEndReached={() => {
          loadMore(increaseRadius(), increaseRadius, collection_.length, geoposition)
      }}
        keyExtractor={item => item.id}
      />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu_item: {
    margin: '4%'
  },
  used_overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    margin: '2%',
    bottom: -10,
    borderRadius: 15,
    
    backgroundColor: 'rgba(52,52,52,0.5)'
  }
});

export default CouponList