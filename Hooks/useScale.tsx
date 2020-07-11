import { Dimensions } from "react-native";
import { useState, useEffect} from 'react'

export interface scaleFunction {
    scale(arg0: number) : number,
}


const guidlineBaseWidth = 340;
const guidlineBaseHeight = 740;

const middle =
  Dimensions.get('window').height / guidlineBaseHeight +
  Dimensions.get('window').width / guidlineBaseWidth;

export const useScale = () => {
    const[state,setState] = useState(() => {
        const scale = (size: number) => (middle / 2) * size;
        return scale
    })

    useEffect(() => {
        Dimensions.addEventListener('change', change => {
            const {window, screen} = change;
            const middle =
              window.height / guidlineBaseHeight +
              window.width / guidlineBaseWidth;
            setState(
                () => (size: number) => (middle / 2) * size
            )
        })
        return () => Dimensions.removeEventListener('change', () => {})
    },[])

    return state;

}