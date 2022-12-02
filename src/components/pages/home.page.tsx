import { MapPinIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "../../hooks/localstorage.hook";
import { useTraffic } from "../../hooks/state/traffic.hook";
import { LatLng } from "../../models/position.model";
import { ITraffic } from "../../models/traffic.model";
import { SimpleButton } from "../base/simple-button";
import { SimpleToggle } from "../base/simple-toggle";
import { SelectGeoLocationModal } from "../traffic/select-geolocation.modal";
import { TrafficDetailsModal } from "../traffic/traffic-details.modal";
import { TrafficList } from "../traffic/traffic.list";
import TrafficMap from "../traffic/traffic.map";
import { ViewedTrafficItemsList } from "../traffic/viewed-traffic-items.list";

export const HomePage = () => {
  const { getByLatLng, addToViewedlist, viewedItems, clearViewedList } =
    useTraffic();

  const [isMapView, setIsMapView, toggleMapView] = useLocalStorage(
    "HomePage_isMapView",
    true
  );

  const [currentPosition, setCurrentPosition] = useState<LatLng | undefined>();
  const [mapPosition, setMapPosition] = useState(currentPosition);
  const [trafficItems, setTrafficItems] = useState<ITraffic[] | undefined>();

  const [selectGeolocationModalOpen, setSelectGeolocationModalOpen] =
    useState(false);
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

  const openSelectLocationModalClick = useCallback(() => {
    setSelectGeolocationModalOpen(true);
  }, []);

  const closeSelectLocationModalClick = useCallback(() => {
    setSelectGeolocationModalOpen(false);
  }, []);

  const onShowOnMapClick = useCallback(
    (item: ITraffic) => {
      setMapPosition({ lat: item.latitude, lng: item.longitude });
      setIsMapView();
      closeDetailItemOnClick();
    },
    [closeDetailItemOnClick, setIsMapView]
  );

  const onSelectGeolocation = useCallback(
    (latLng: LatLng) => {
      setCurrentPosition(latLng);
      closeSelectLocationModalClick();
    },
    [closeSelectLocationModalClick]
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (!currentPosition) return;

    getByLatLng(currentPosition?.lat, currentPosition?.lng).then(
      (trafficResult) => {
        setTrafficItems(trafficResult);
      }
    );
  }, [currentPosition, getByLatLng]);

  useEffect(() => {
    setMapPosition(currentPosition);
  }, [currentPosition]);

  return (
    <>
      <SelectGeoLocationModal
        onClose={closeSelectLocationModalClick}
        onSelect={onSelectGeolocation}
        isOpen={selectGeolocationModalOpen}
        initialPosition={currentPosition}
      />
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
              <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-8">
                    <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
                      <div className="flex flex-col sm:flex-row xl:flex-col">
                        <div>
                          <p className="font-semibold text-gray-600 mb-2">
                            Din position:
                          </p>
                          <SimpleButton
                            primary
                            onClick={openSelectLocationModalClick}
                            title={
                              !currentPosition
                                ? "Ingen position vald "
                                : `${currentPosition?.lat} ${currentPosition?.lng}`
                            }
                            leftIcon={MapPinIcon}
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        {viewedItems.length > 0 && (
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-700 text-md">
                              Tidigare visade inlägg
                            </h3>

                            <SimpleButton
                              leftIcon={XMarkIcon}
                              onClick={clearViewedList}
                            />
                          </div>
                        )}
                        <ViewedTrafficItemsList
                          items={viewedItems}
                          openDetailItemOnClick={openDetailItemOnClick}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="border-b border-t border-gray-200 pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
                <div className="flex items-center justify-between">
                  <h1 className="flex-1 text-lg font-medium">
                    Trafikstörningar
                  </h1>
                  <SimpleToggle
                    title="Kartvy"
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
