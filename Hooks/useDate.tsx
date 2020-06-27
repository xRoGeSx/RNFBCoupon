import { useState, useEffect } from "react";


export const useDate = () => {
    const [state, setState] = useState(() => {
        const now = Date.now();
        return now
    })

    const onChange = (newDate : number) => {
        setState(newDate)
    }

    useEffect(() => {
        const interval = setInterval(() => {
             onChange(Date.now())
        },1000)
        return () => clearInterval(interval)
    },[])

    return state;
}