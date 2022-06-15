import { createElement, ReactNode, useState, useEffect, Fragment } from "react";
import { MapSwitcher } from "./components/MapSwitcher";
import Spinner from "./components/Spinner";

import { MapsContainerProps } from "../typings/MapsProps";
import { useLocationResolver, convertAddressToLatLng, LatLng } from "./utils/geodecode";
import { getCurrentUserLocation } from "./utils/location";
import { LazyLoading, Marker } from "../typings/shared";
import { translateZoom } from "./utils/zoom";
import { ValueStatus } from "mendix";
import "leaflet/dist/leaflet.css";
import "./ui/Maps.scss";
import "./ui/Spinner.scss";

// used if the attributes are set, but their values are empty
const RotterdamLatlng: LatLng = {
    latitude: 51.906688,
    longitude: 4.48837
};

export default function Maps(props: MapsContainerProps): ReactNode {
    // monitor the status of each api call
    const [currentLocation, setCurrentLocation] = useState<Marker>();
    const [defaultLocation, setDefaultLocation] = useState<LatLng>();
    const [locations, setLocations] = useState<Marker[]>([]);
    const [locationsResolved, setLocationsResolved] = useState<boolean>(false);

    const debug = props.debugMode;
    const lazyLoading: LazyLoading = {
        behavior: props.lazyLoadBehavior,
        spinnerColor: props.spinnerColor?.value || "grey",
        spinnerSize: props.spinnerSize.value || "5em",
        spinnerCaption: props.spinnerCaption?.value,
        spinnerThickness: props.spinnerThickness.value || "0.5em"
    };

    debug && console.log("Mendix Props: ", props);

    useEffect(() => {
        // resolve default location
        if (
            props.address?.status === ValueStatus.Available &&
            props.latitude?.status === ValueStatus.Available &&
            props.longitude?.status === ValueStatus.Available
        ) {
            switch (props.locationType) {
                case "address":
                    if (props.address.value.trim() !== "") {
                        debug && console.log("Started resolving default address");
                        convertAddressToLatLng([{ address: props.address.value }], props.geodecodeApiKey?.value).then(
                            (results: Marker[]) => {
                                if (results.length > 0) {
                                    setDefaultLocation(results[0]);
                                    debug &&
                                        console.log("Default address resolved as latitude and longitude: ", {
                                            latitude: results[0].latitude,
                                            longitude: results[0].longitude
                                        });
                                } else {
                                    throw new Error(`Unable to search for default address: ${props.address?.value}`);
                                }
                            }
                        );
                    } else {
                        setDefaultLocation(RotterdamLatlng);
                        debug && console.log("Default address is empty ... resolving as Rotterdam");
                    }
                    break;
                case "latlng":
                    debug && console.log("Started resolving default latitude and longitude");
                    if (props.latitude.value.trim() !== "" && props.longitude.value.trim() !== "") {
                        setDefaultLocation({
                            latitude: Number(props.latitude.value),
                            longitude: Number(props.longitude.value)
                        });
                        debug &&
                            console.log("Default address resolved as latitude and longitude: ", {
                                latitude: Number(props.latitude.value),
                                longitude: Number(props.longitude.value)
                            });
                    } else {
                        setDefaultLocation(RotterdamLatlng);
                        debug && console.log("Default latitude and/or longitude are empty ... resolving as Rotterdam");
                    }
                    break;
            }
        }

        // resolve current location if enabled
        if (props.showCurrentLocation) {
            debug && console.log("Started resolving current location");
            getCurrentUserLocation()
                .then((currentLocation: Marker) => {
                    setCurrentLocation(currentLocation);
                    debug && console.log("Current location resolved: ", currentLocation);
                })
                .catch(e => console.error(e));
        } else {
            setCurrentLocation(undefined);
            debug && console.log("Show current location disabled ... skipping");
        }

        // resolve marker lists
        if (
            props.dynamicMarkers === [] ||
            props.dynamicMarkers.every(dynamicMarker => dynamicMarker.markersDS?.status === ValueStatus.Available)
        ) {
            debug &&
                console.log("Started resolving markers ...", {
                    staticMarkers: props.markers,
                    dynamicMarkers: props.dynamicMarkers
                });
            useLocationResolver(props.markers, props.dynamicMarkers, props.geodecodeApiKey?.value).then(
                (locations: Marker[]) => {
                    setLocations(locations);
                    setLocationsResolved(true);
                    debug && console.log("Markers resolved: ", locations);
                }
            );
        }
    }, [props.markers, props.dynamicMarkers]);

    if (
        ((currentLocation !== undefined || props.showCurrentLocation === false) &&
            locationsResolved &&
            defaultLocation !== undefined &&
            props.apiKey?.status === ValueStatus.Available) ||
        lazyLoading.behavior === "showMap"
    ) {
        debug &&
            console.log("All states resolved ... showing map: ", {
                currentLocation,
                defaultLocation,
                locations,
                locationsResolved
            });
        return (
            <MapSwitcher
                attributionControl={props.attributionControl}
                autoZoom={props.zoom === "automatic"}
                className={props.class}
                currentLocation={currentLocation}
                fullscreenControl={props.fullScreenControl}
                height={props.height}
                heightUnit={props.heightUnit}
                locations={locations}
                mapsToken={props.apiKey?.value}
                mapProvider={props.mapProvider}
                mapStyles={props.mapStyles}
                mapTypeControl={props.mapTypeControl}
                optionDrag={props.optionDrag}
                optionScroll={props.optionScroll}
                optionZoomControl={props.optionZoomControl}
                rotateControl={props.rotateControl}
                showCurrentLocation={props.showCurrentLocation}
                streetViewControl={props.optionStreetView}
                style={props.style}
                width={props.width}
                widthUnit={props.widthUnit}
                zoomLevel={translateZoom(props.zoom)}
                defaultLocation={defaultLocation || RotterdamLatlng}
                lazyLoading={lazyLoading}
            />
        );
    } else {
        if (lazyLoading.behavior === "spinner") {
            debug &&
                console.log("States still resolving ... showing spinner: ", {
                    currentLocation,
                    defaultLocation,
                    locations,
                    locationsResolved
                });
            return (
                <Spinner
                    color={lazyLoading.spinnerColor}
                    size={lazyLoading.spinnerSize}
                    caption={lazyLoading.spinnerCaption}
                    thickness={lazyLoading.spinnerThickness}
                />
            );
        } else {
            debug &&
                console.log("States still resolving ... showing nothing: ", {
                    currentLocation,
                    defaultLocation,
                    locations,
                    locationsResolved
                });
            return <Fragment />;
        }
    }
}
