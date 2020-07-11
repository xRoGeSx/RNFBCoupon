import { useState, useEffect } from "react";
import { IUser } from "../Types/IUser";
import firestore from '@react-native-firebase/firestore'






export const useUserData = (uid : string | undefined) => {

    const [state,setState]= useState(() => {
        const userData : IUser | undefined = undefined;
        return {
            initializing_ud : true,
            userData : userData
        }
    })


    useEffect(() => {
        if(uid) {
        const subscriber = firestore()
        .collection('users')
        .doc(uid)
        .onSnapshot(docSnapshot => {
            console.log("User data loaded")
            const data = docSnapshot.data();
            const new_user : IUser = {
                acces_type   : data?.acces_type,
                email        : data?.email,
                used_coupons : data?.used_coupons,
            }
            setState({initializing_ud : false, userData : new_user})
        }) 
        return () => subscriber();
        }
    }, [])

    return state;
}