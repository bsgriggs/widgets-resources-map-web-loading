import { Dimensions } from "@mendix/piw-utils-internal";
import { CSSProperties } from "react";
import { LatLng } from "../src/utils/geodecode";
export interface ModeledMarker {
    address?: string;
    latitude?: number;
    longitude?: number;
    title?: string;
    customMarker?: string;
    action?: () => void;
}

export interface Marker {
    latitude: number;
    longitude: number;
    url: string;
    onClick?: () => void;
    title?: string;
}

export interface LazyLoading {
    behavior: LazyLoadBehaviorEnum;
    spinnerCaption?: string;
    spinnerColor: string;
    spinnerSize: string;
    spinnerThickness: string;
}

export interface SharedProps extends Dimensions {
    autoZoom: boolean;
    optionZoomControl: boolean;
    zoomLevel: number;
    optionDrag: boolean;
    optionScroll: boolean;
    showCurrentLocation: boolean;
    currentLocation?: Marker;
    locations: Marker[];
    defaultLocation: LatLng;
    lazyLoading: LazyLoading;
    mapsToken?: string;
    className?: string;
    style?: CSSProperties;
}
