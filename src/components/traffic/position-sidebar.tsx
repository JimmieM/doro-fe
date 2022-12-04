import { MapPinIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { FC, useCallback, useMemo, useState } from "react";
import { useCurrentPosition } from "../../hooks/state/current-position.hook";
import { useTraffic } from "../../hooks/state/traffic.hook";
import { LatLng } from "../../models/position.model";
import { ITraffic } from "../../models/traffic.model";
import { SimpleButton } from "../base/simple-button";
import { SelectGeoLocationModal } from "./select-geolocation.modal";
import { ViewedTrafficItemsList } from "./viewed-traffic-items.list";

interface PositionSidebarProps {
  openDetailItemOnClick: (item: ITraffic) => void;
}

export const PositionSidebar: FC<PositionSidebarProps> = ({
  openDetailItemOnClick,
}) => {
  const { viewedItems, clearViewedList } = useTraffic();

  const { position, city, setPosition } = useCurrentPosition();

  const [selectGeolocationModalOpen, setSelectGeolocationModalOpen] =
    useState(false);

  const openSelectLocationModalClick = useCallback(() => {
    setSelectGeolocationModalOpen(true);
  }, []);

  const closeSelectLocationModalClick = useCallback(() => {
    setSelectGeolocationModalOpen(false);
  }, []);

  const onSelectGeolocation = useCallback(
    (latLng: LatLng) => {
      setPosition(latLng);
      closeSelectLocationModalClick();
    },
    [closeSelectLocationModalClick, setPosition]
  );

  const positionButtonTitleMemo = useMemo(
    () =>
      !position && !city
        ? "Välj en position"
        : city
        ? city
        : `${position?.lat} ${position?.lng}`,
    [city, position]
  );

  return (
    <>
      <SelectGeoLocationModal
        onClose={closeSelectLocationModalClick}
        onSelect={onSelectGeolocation}
        isOpen={selectGeolocationModalOpen}
        initialPosition={position}
      />
      <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-8">
            <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
              <div className="flex flex-col sm:flex-row xl:flex-col">
                <div>
                  <p className="font-semibold text-sm text-gray-500 mb-2">
                    Din position
                  </p>
                  <SimpleButton
                    primary
                    fullWidth
                    onClick={openSelectLocationModalClick}
                    title={positionButtonTitleMemo}
                    leftIcon={MapPinIcon}
                  />
                  {position && (
                    <p className="mt-2 text-xs font-normal text-gray-500">
                      Koordinater:{" "}
                      {`${position?.lat.toFixed(4)} ${position?.lng.toFixed(
                        4
                      )}`}
                    </p>
                  )}
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
    </>
  );
};
