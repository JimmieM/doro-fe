import { Marker } from "@react-google-maps/api";
import { FC, useMemo } from "react";
import { LatLng } from "../../models/position.model";
import { ITraffic } from "../../models/traffic.model";
import { SimpleMap } from "../base/simple-map";

interface TrafficMapProps {
  currentPosition: LatLng | undefined;
  items: ITraffic[] | undefined;
  onItemClick: (item: ITraffic) => void;
}

export const TrafficMap: FC<TrafficMapProps> = ({
  items,
  onItemClick,
  currentPosition,
}) => {
  const markers = useMemo(
    () =>
      items
        ? items.map((item, idx) => (
            <Marker
              key={idx}
              label={item.title}
              title={item.title}
              position={{ lat: item.latitude, lng: item.longitude }}
              onClick={() => onItemClick(item)}
            />
          ))
        : undefined,
    [items, onItemClick]
  );

  return <SimpleMap initialPosition={currentPosition}>{markers}</SimpleMap>;
};
