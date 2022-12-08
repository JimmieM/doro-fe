import {
  GoogleMap,
  GoogleMapProps,
  useJsApiLoader,
} from "@react-google-maps/api";
import { FC, useCallback, useRef, useState } from "react";
import Config from "../../config";
import { LatLng } from "../../models/position.model";

interface SimpleMapProps {
  initialPosition?: LatLng | undefined;
  onSelectLatLng?: (latLng: LatLng) => void;
  children: JSX.Element[] | JSX.Element | undefined;
}

const containerStyle = {
  width: "100%",
  height: "600px",
};

export const SimpleMap: FC<SimpleMapProps> = ({
  initialPosition,
  onSelectLatLng,
  children,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: Config.gmapsApiKey || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      const bounds = new window.google.maps.LatLngBounds(initialPosition);
      map.fitBounds(bounds);

      setMap(map);
    },
    [initialPosition]
  );

  const onUnmount = useCallback(function callback(_map: google.maps.Map) {
    setMap(null);
  }, []);

  const onPositionClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      if (!lat || !lng) return;

      onSelectLatLng?.({ lat, lng });
    },
    [onSelectLatLng]
  );

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={initialPosition}
      zoom={10}
      onLoad={onLoad}
      onClick={onPositionClick}
      onUnmount={onUnmount}
    >
      {children}
    </GoogleMap>
  ) : (
    <>Laddar ...</>
  );
};
