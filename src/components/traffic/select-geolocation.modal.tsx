import { Marker } from "@react-google-maps/api";
import { FC, useCallback, useMemo, useState } from "react";
import { LatLng } from "../../models/position.model";
import { SimpleMap } from "../base/simple-map";
import { SimpleModal } from "../base/simple-modal";

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
  const [selectedLatLng, setSelectedLatLng] = useState<LatLng>();

  const onPositionClick = useCallback((pos: LatLng) => {
    setSelectedLatLng(pos);
  }, []);

  const contentMemo = useMemo(
    () => (
      <>
        <SimpleMap
          onSelectLatLng={onPositionClick}
          initialPosition={initialPosition}
        >
          <>
            {selectedLatLng && (
              <Marker position={selectedLatLng} title="Vald position" />
            )}
            {initialPosition && !selectedLatLng && (
              <Marker position={initialPosition} title="Din position" />
            )}
          </>
        </SimpleMap>
      </>
    ),
    [initialPosition, onPositionClick, selectedLatLng]
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
      open={isOpen}
      content={contentMemo}
      buttons={buttonsMemo}
    />
  );
};
