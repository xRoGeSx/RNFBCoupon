import { useContext, useState, useEffect } from "react";
import auth, { FirebaseAuthTypes, firebase } from '@react-native-firebase/auth'
import React from "react";




export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = auth().currentUser
    return {
      initializing: !user,
      user: user,
    }
  })

  const onChange = (user: FirebaseAuthTypes.User | null) => {
    console.log("User authorized")
    setState({ initializing: false, user })
  }

  useEffect(() => {
    if (state.initializing) {
      const unsubscibe = firebase.auth().onAuthStateChanged(onChange)
      return () => unsubscibe()
    }
  }, [])

  return state;

}