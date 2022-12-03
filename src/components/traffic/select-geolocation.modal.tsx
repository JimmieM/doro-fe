import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import { FC, useCallback, useMemo, useState } from "react";
import Config from "../../config";
import { LatLng } from "../../models/position.model";
import { SimpleModal } from "../base/simple-modal";

const containerStyle = {
  width: "100%",
  height: "600px",
};

interface SelectGeoLocationModalProps {
  isOpen: boolean;
  initialPosition: LatLng | undefined;
  onSelect: (latLng: LatLng) => void;
  onClose: () => void;
}

export const SelectGeoLocationModal: FC<SelectGeoLocationModalProps> = ({
  initialPosition,
  isOpen,
  onSelect,
  onClose,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: Config.gmapsApiKey || "",
  });

  const [selectedLatLng, setSelectedLatLng] = useState<LatLng>();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      const bounds = new window.google.maps.LatLngBounds(initialPosition);
      map.fitBounds(bounds);

      setMap(map);
    },
    [initialPosition]
  );

  const onUnmount = React.useCallback(function callback(_map: google.maps.Map) {
    setMap(null);
  }, []);

  const onPositionClick = useCallback((event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (!lat || !lng) return;

    setSelectedLatLng({ lat, lng });
  }, []);

  const contentMemo = useMemo(
    () => (
      <>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={initialPosition}
          zoom={10}
          onLoad={onLoad}
          onClick={onPositionClick}
          onUnmount={onUnmount}
        >
          {selectedLatLng && (
            <Marker
              position={{ lat: selectedLatLng.lat, lng: selectedLatLng.lng }}
              title="Vald position"
            />
          )}
          {initialPosition && !selectedLatLng && (
            <Marker
              position={{ lat: initialPosition.lat, lng: initialPosition.lng }}
              title="Din position"
            />
          )}
        </GoogleMap>
      </>
    ),
    [initialPosition, onLoad, onPositionClick, onUnmount, selectedLatLng]
  );

  const buttonsMemo = useMemo(
    () => [
      {
        label: "Stäng",
        onClick: () => onClose(),
      },
      {
        disabled: !selectedLatLng,
        label: "Spara position",
        primary: true,
        onClick: () => selectedLatLng && onSelect(selectedLatLng),
      },
    ],
    [onClose, onSelect, selectedLatLng]
  );

  return (
    <SimpleModal
      title={
        selectedLatLng
          ? `Vald position: lat: ${selectedLatLng.lat} lng: ${selectedLatLng.lng}`
          : "Välj en position"
      }
      onClose={onClose}
      open={!!isLoaded && isOpen}
      content={contentMemo}
      buttons={buttonsMemo}
    />
  );
};
