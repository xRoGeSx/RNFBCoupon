import { View, Button } from "react-native"
import React,{ useState, useEffect } from 'react';
import { IUser } from "../Types/IUser";
import { GoogleSignin } from "@react-native-community/google-signin";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'



const GoogleSignIn = () => (
    <Button
        onPress={ onGoogleSignInButtonPress}
        title="Sign in with Google"
          />
  )

  const onGoogleSignInButtonPress = async () => {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const user = await auth().signInWithCredential(googleCredential);
    console.log(user.additionalUserInfo?.isNewUser)
    if(user.additionalUserInfo?.isNewUser)
    createUserDoc(user);
    return user;
  }

  const createUserDoc = (user : FirebaseAuthTypes.UserCredential) => {
    let storedUser : IUser
    storedUser = {
      email: user.user.email,
      acces_type: 'freebie',
      used_coupons: [{
        coupon_id: '',
        used_at: 0, 
      }]
    }
    firestore().collection('users').doc(user.user.uid).set(storedUser)
}


const WelcomeScreen : React.FC = () => {
    return (
        <View>
            {GoogleSignIn()}
        </View>
    )
}

export default WelcomeScreen