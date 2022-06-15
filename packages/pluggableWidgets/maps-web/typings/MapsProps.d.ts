/**
 * This file was generated from Maps.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, ListValue, ListActionValue, ListAttributeValue, WebImage } from "mendix";
import { Big } from "big.js";

export type LocationTypeEnum = "address" | "latlng";

export type MarkerStyleEnum = "default" | "image";

export interface MarkersType {
    locationType: LocationTypeEnum;
    address?: DynamicValue<string>;
    latitude?: DynamicValue<string>;
    longitude?: DynamicValue<string>;
    title?: DynamicValue<string>;
    onClick?: ActionValue;
    markerStyle: MarkerStyleEnum;
    customMarker?: DynamicValue<WebImage>;
}

export type LocationTypeEnum = "address" | "latlng";

export type MarkerStyleDynamicEnum = "default" | "image";

export interface DynamicMarkersType {
    markersDS?: ListValue;
    locationType: LocationTypeEnum;
    address?: ListAttributeValue<string>;
    latitude?: ListAttributeValue<Big>;
    longitude?: ListAttributeValue<Big>;
    title?: ListAttributeValue<string>;
    onClickAttribute?: ListActionValue;
    markerStyleDynamic: MarkerStyleDynamicEnum;
    customMarkerDynamic?: DynamicValue<WebImage>;
}

export type LocationTypeEnum = "address" | "latlng";

export type WidthUnitEnum = "percentage" | "pixels";

export type HeightUnitEnum = "percentageOfWidth" | "pixels" | "percentageOfParent";

export type ZoomEnum = "automatic" | "world" | "continent" | "city" | "street" | "buildings";

export type MapProviderEnum = "googleMaps" | "openStreet" | "mapBox" | "hereMaps";

export interface MarkersPreviewType {
    locationType: LocationTypeEnum;
    address: string;
    latitude: string;
    longitude: string;
    title: string;
    onClick: {} | null;
    markerStyle: MarkerStyleEnum;
    customMarker: { type: "static"; imageUrl: string } | { type: "dynamic"; entity: string } | null;
}

export interface DynamicMarkersPreviewType {
    markersDS: {} | { type: string } | null;
    locationType: LocationTypeEnum;
    address: string;
    latitude: string;
    longitude: string;
    title: string;
    onClickAttribute: {} | null;
    markerStyleDynamic: MarkerStyleDynamicEnum;
    customMarkerDynamic: { type: "static"; imageUrl: string } | { type: "dynamic"; entity: string } | null;
}

export interface MapsContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    advanced: boolean;
    markers: MarkersType[];
    dynamicMarkers: DynamicMarkersType[];
    apiKey?: DynamicValue<string>;
    geodecodeApiKey?: DynamicValue<string>;
    showCurrentLocation: boolean;
    locationType: LocationTypeEnum;
    address?: DynamicValue<string>;
    latitude?: DynamicValue<string>;
    longitude?: DynamicValue<string>;
    optionDrag: boolean;
    optionScroll: boolean;
    optionZoomControl: boolean;
    attributionControl: boolean;
    optionStreetView: boolean;
    mapTypeControl: boolean;
    fullScreenControl: boolean;
    rotateControl: boolean;
    widthUnit: WidthUnitEnum;
    width: number;
    heightUnit: HeightUnitEnum;
    height: number;
    zoom: ZoomEnum;
    mapProvider: MapProviderEnum;
    mapStyles: string;
    lazyLoadingContent?: ReactNode;
}

export interface MapsPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    advanced: boolean;
    markers: MarkersPreviewType[];
    dynamicMarkers: DynamicMarkersPreviewType[];
    apiKey: string;
    geodecodeApiKey: string;
    showCurrentLocation: boolean;
    locationType: LocationTypeEnum;
    address: string;
    latitude: string;
    longitude: string;
    optionDrag: boolean;
    optionScroll: boolean;
    optionZoomControl: boolean;
    attributionControl: boolean;
    optionStreetView: boolean;
    mapTypeControl: boolean;
    fullScreenControl: boolean;
    rotateControl: boolean;
    widthUnit: WidthUnitEnum;
    width: number | null;
    heightUnit: HeightUnitEnum;
    height: number | null;
    zoom: ZoomEnum;
    mapProvider: MapProviderEnum;
    mapStyles: string;
    lazyLoadingContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
}
