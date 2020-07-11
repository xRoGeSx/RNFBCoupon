import { createContext } from "react";

export interface GeoPositionContext {
    latitude: number,
    longitude: number,
}

export const GeoPositionContext = createContext<GeoPositionContext>({
    longitude: 0,
    latitude: 0,
})