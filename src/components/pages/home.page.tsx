import { GlobeEuropeAfricaIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "../../hooks/localstorage.hook";
import { useCurrentPosition } from "../../hooks/state/current-position.hook";
import { useTraffic } from "../../hooks/state/traffic.hook";
import { ITraffic } from "../../models/traffic.model";
import { SimpleToggle } from "../base/simple-toggle";
import { PositionSidebar } from "../traffic/position-sidebar";
import { TrafficDetailsModal } from "../traffic/traffic-details.modal";
import { TrafficList } from "../traffic/traffic.list";
import TrafficMap from "../traffic/traffic.map";

const MAP_VIEW_LOCALSTORAGE_KEY = "HomePage_isMapView";

export const HomePage = () => {
  const { items: trafficItems, addToViewedlist } = useTraffic();
  const { position, city } = useCurrentPosition();

  const [isMapView, setIsMapView, toggleMapView] = useLocalStorage(
    MAP_VIEW_LOCALSTORAGE_KEY,
    false
  );

  const [mapPosition, setMapPosition] = useState(position);

  const [trafficDetailsModalOpen, setTrafficDetailsModalOpen] =
    useState<ITraffic | null>();

  const openDetailItemOnClick = useCallback(
    (item: ITraffic) => {
      setTrafficDetailsModalOpen(item);
      addToViewedlist(item);
    },
    [addToViewedlist]
  );

  const closeDetailItemOnClick = useCallback(() => {
    setTrafficDetailsModalOpen(undefined);
  }, []);

  const onShowOnMapClick = useCallback(
    (item: ITraffic) => {
      setMapPosition({ lat: item.latitude, lng: item.longitude });
      setIsMapView(true);
      closeDetailItemOnClick();
    },
    [closeDetailItemOnClick, setIsMapView]
  );

  useEffect(() => {
    setMapPosition(position);
  }, [position]);

  return (
    <>
      {!!trafficDetailsModalOpen && (
        <TrafficDetailsModal
          showOnMap={onShowOnMapClick}
          item={trafficDetailsModalOpen}
          onClose={closeDetailItemOnClick}
        />
      )}
      <div className="relative flex min-h-full flex-col">
        <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
          <div className="min-w-0 flex-1 bg-white xl:flex">
            <div className="bg-white xl:w-64 xl:flex-shrink-0 xl:border-r xl:border-gray-200">
              <PositionSidebar openDetailItemOnClick={openDetailItemOnClick} />
            </div>
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="border-b border-t border-gray-200 pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
                <div className="flex items-center justify-between">
                  <h1 className="flex-1 text-lg font-medium">
                    Trafikstörningar {city ? `nära ${city}` : ""}
                  </h1>
                  <SimpleToggle
                    title={
                      <GlobeEuropeAfricaIcon className="w-6 h-6  text-gray-500" />
                    }
                    enabled={isMapView}
                    onChange={() => toggleMapView()}
                  />
                </div>
              </div>
              {isMapView ? (
                <TrafficMap
                  currentPosition={mapPosition}
                  items={trafficItems}
                  onItemClick={openDetailItemOnClick}
                />
              ) : (
                <TrafficList
                  onItemClick={openDetailItemOnClick}
                  items={trafficItems}
                />
              )}
            </div>
          </div>
          <div className="bg-gray-50 pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0"></div>
        </div>
      </div>
    </>
  );
};
