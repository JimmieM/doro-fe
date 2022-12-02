import React, { FC, useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Config from "../../config";
import { LatLng } from "../../models/position.model";
import { ITraffic } from "../../models/traffic.model";

const containerStyle = {
  width: "100%",
  height: "600px",
};

interface TrafficMapProps {
  currentPosition: LatLng | undefined;
  items: ITraffic[] | undefined;
  onItemClick: (item: ITraffic) => void;
}

const TrafficMap: FC<TrafficMapProps> = ({
  currentPosition,
  items,
  onItemClick,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: Config.gmapsApiKey || "",
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback(
    function callback(map: google.maps.Map) {
      const bounds = new window.google.maps.LatLngBounds(currentPosition);
      map.fitBounds(bounds);

      setMap(map);
    },
    [currentPosition]
  );

  const onUnmount = React.useCallback(function callback(_map: google.maps.Map) {
    setMap(null);
  }, []);

  const markers = useMemo(
    () =>
      items
        ? items.map((item) => (
            <Marker
              label={item.title}
              position={{ lat: item.latitude, lng: item.longitude }}
              onClick={() => onItemClick(item)}
            />
          ))
        : undefined,
    [items, onItemClick]
  );

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition}
      zoom={9}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {markers}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(TrafficMap);
