import { createElement, ReactNode, useState, useEffect, Fragment } from "react";
import { MapSwitcher } from "./components/MapSwitcher";

import { MapsContainerProps } from "../typings/MapsProps";
import { useLocationResolver, convertAddressToLatLng, LatLng } from "./utils/geodecode";
import { getCurrentUserLocation } from "./utils/location";
import { Marker } from "../typings/shared";
import { translateZoom } from "./utils/zoom";
import { ValueStatus } from "mendix";
import "leaflet/dist/leaflet.css";
import "./ui/Maps.scss";

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

    console.debug("Mendix Maps-Web - Props: ", props);

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
                        console.debug("Mendix Maps-Web - Started resolving default address");
                        convertAddressToLatLng([{ address: props.address.value }], props.geodecodeApiKey?.value).then(
                            (results: Marker[]) => {
                                if (results.length > 0) {
                                    setDefaultLocation(results[0]);
                                    console.debug(
                                        "Mendix Maps-Web - Default address resolved as latitude and longitude: ",
                                        {
                                            latitude: results[0].latitude,
                                            longitude: results[0].longitude
                                        }
                                    );
                                } else {
                                    console.error(
                                        `Mendix Maps-Web - Unable to search for default address: ${props.address?.value}`
                                    );
                                }
                            }
                        );
                    } else {
                        setDefaultLocation(RotterdamLatlng);
                        console.debug("Mendix Maps-Web - Default address is empty ... resolving as Rotterdam");
                    }
                    break;
                case "latlng":
                    console.debug("Mendix Maps-Web - Started resolving default latitude and longitude");
                    if (props.latitude.value.trim() !== "" && props.longitude.value.trim() !== "") {
                        setDefaultLocation({
                            latitude: Number(props.latitude.value),
                            longitude: Number(props.longitude.value)
                        });
                        console.debug("Mendix Maps-Web - Default address resolved as latitude and longitude: ", {
                            latitude: Number(props.latitude.value),
                            longitude: Number(props.longitude.value)
                        });
                    } else {
                        setDefaultLocation(RotterdamLatlng);
                        console.debug(
                            "Mendix Maps-Web - Default latitude and/or longitude are empty ... resolving as Rotterdam"
                        );
                    }
                    break;
            }
        }

        // resolve current location if enabled
        if (props.showCurrentLocation) {
            console.debug("Mendix Maps-Web - Started resolving current location");
            getCurrentUserLocation()
                .then((currentLocation: Marker) => {
                    setCurrentLocation(currentLocation);
                    console.debug("Current location resolved: ", currentLocation);
                })
                .catch(e => console.error(e));
        } else {
            setCurrentLocation(undefined);
            console.debug("Mendix Maps-Web - Show current location disabled ... skipping");
        }

        // resolve marker lists
        if (
            props.dynamicMarkers === [] ||
            props.dynamicMarkers.every(dynamicMarker => dynamicMarker.markersDS?.status === ValueStatus.Available)
        ) {
            console.debug("Mendix Maps-Web - Started resolving markers ...", {
                staticMarkers: props.markers,
                dynamicMarkers: props.dynamicMarkers
            });
            useLocationResolver(props.markers, props.dynamicMarkers, props.geodecodeApiKey?.value).then(
                (locations: Marker[]) => {
                    setLocations(locations);
                    setLocationsResolved(true);
                    console.debug("Mendix Maps-Web - Markers resolved: ", locations);
                }
            );
        }
    }, [props.markers, props.dynamicMarkers]);

    if (
        ((currentLocation !== undefined || props.showCurrentLocation === false) &&
            locationsResolved &&
            defaultLocation !== undefined &&
            props.apiKey?.status === ValueStatus.Available) ||
        (props.lazyLoadingContent === undefined && defaultLocation !== undefined)
    ) {
        props.lazyLoadingContent === undefined
            ? console.debug("Mendix Maps-Web - No lazy loading content set ... showing map: ", {
                  currentLocation,
                  defaultLocation,
                  locations,
                  locationsResolved
              })
            : console.debug("Mendix Maps-Web - All states resolved ... showing map: ", {
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
                defaultLocation={defaultLocation}
            />
        );
    } else {
        if (props.lazyLoadingContent !== undefined) {
            console.debug("Mendix Maps-Web - States still resolving ... showing lazy loading content: ", {
                currentLocation,
                defaultLocation,
                locations,
                locationsResolved
            });
            return props.lazyLoadingContent;
        } else {
            console.debug("Mendix Maps-Web - States still resolving ... showing nothing: ", {
                currentLocation,
                defaultLocation,
                locations,
                locationsResolved
            });
            return <Fragment />;
        }
    }
}
