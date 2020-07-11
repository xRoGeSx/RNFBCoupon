import { ICoupon } from "../Types/ICoupon";
import { createContext } from "react";
import { IUser } from "../Types/IUser";

interface CollectinContextProps {
    collectionData: ICoupon[],
    userData:       IUser | undefined,
    loadMore: (radius: number, increaseRadius: Function, currentLength: number) => Promise<void> | Function,
    increaseRadius?: () => number

}


export const CollectionContext = createContext<CollectinContextProps>({
    collectionData: [],
    userData: undefined,
    loadMore: () => {null},
})