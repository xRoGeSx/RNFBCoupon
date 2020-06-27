import { useContext, useState, useEffect } from "react";
import auth, { FirebaseAuthTypes, firebase } from '@react-native-firebase/auth'
import React from "react";


const userContext = React.createContext({
    user: null,
  })
  
 export const useSession = () => {
    const {user} = useContext(userContext)
    return user;
  }
  
  export const useAuth = () => {
    const [state,setState] = useState(() => {
      const user = auth().currentUser
      return {
        initializing: !user, user
      }
    })
  
    const onChange = (user : FirebaseAuthTypes.User | null) => {
      setState({initializing: false, user})
    }
  
    useEffect(() => {
      const unsubscibe = firebase.auth().onAuthStateChanged(onChange)
      return unsubscibe
    }, [])
  
    return state;
  
  }