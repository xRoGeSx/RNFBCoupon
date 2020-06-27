import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import {ICoupon} from '../Types/ICoupon'
import Coupon from '../Components/Coupon'
import {IUser} from '../Types/IUser'


const SignOut = () => (
  <Button
    title="Sign out"
    onPress= { () => {
      auth().signOut()
    }}
  />
)




const CouponList : React.FC = () => {
  const [userDocRef, setUserDocRef] = useState<FirebaseFirestoreTypes.DocumentSnapshot>();
  const [isLoaded, setLoaded] = useState(false)
  const [collection, setCollection] = useState<ICoupon[]>([])
  let temp : ICoupon[];

  const checkForUsed = (document_id : string, uData : FirebaseFirestoreTypes.DocumentSnapshot) => {
    let used_coupons : IUser["used_coupons"];
    used_coupons = uData.data().used_coupons;
    const result = used_coupons.filter( used_coupon => used_coupon.coupon_id == document_id);
    return result.length && true ? result[0].available_at : 0
  }

  if(!isLoaded) {
  firestore().collection('users').doc(auth().currentUser?.uid).get().then(uData => {
    setUserDocRef(uData)
    let acces_type = uData.data()?.acces_type;
    firestore().collection('coupons').where('available_to', 'array-contains', acces_type).get().then((data) => {
      temp = [];
      data.forEach(document => {
        const data =  document.data();
        const newCoupon : ICoupon = {
          id: document.id,
          reusable_in: data.reusable_in,
          active_time: data.active_time,
          description_full: data.description_full,
          description_short: data.description_short,
          title: data.title,
          valid: data.valid,
          used: checkForUsed(document.id, uData),
        }
        temp.push(newCoupon)
      })
      setCollection(temp)
      setLoaded(true)
    })
  })
}
  if(!isLoaded)
  return (
    <View style={styles.container}>
      <Text> Not loaded </Text>
    </View>
  )
  return(
    <View>
      <Text>Welcome, {userDocRef?.data().email}</Text>
      <FlatList data={collection} renderItem={({item}) => {
        const {active_time, description_full, description_short, title, valid} = item;
        return (
          <Coupon coupon_info = {item} userDocRef={userDocRef}/>
        )
      }}/>
      {SignOut()}

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
});

export default CouponList