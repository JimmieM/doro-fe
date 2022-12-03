import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { FC } from "react";
import { ITraffic } from "../../models/traffic.model";

interface ViewedTrafficItemsListProps {
  items: ITraffic[];
  openDetailItemOnClick: (item: ITraffic) => void;
}

export const ViewedTrafficItemsList: FC<ViewedTrafficItemsListProps> = ({
  items,
  openDetailItemOnClick,
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-2">
      {items.map((item, idx) => (
        <ViewedTrafficListItem
          key={idx}
          item={item}
          openDetailItemOnClick={openDetailItemOnClick}
        />
      ))}
    </div>
  );
};

interface ViewedTrafficListItemProps {
  item: ITraffic;
  openDetailItemOnClick: (item: ITraffic) => void;
}

export const ViewedTrafficListItem: FC<ViewedTrafficListItemProps> = ({
  item,
  openDetailItemOnClick,
}) => {
  return (
    <div
      onClick={() => openDetailItemOnClick(item)}
      className="flex justify-between bg-gray-50 rounded-md p-2 pl-4 hover:cursor-pointer hover:underline hover:bg-gray-100"
    >
      <p className="font-semibold text-sm text-gray-700">{item.title}</p>
      <ChevronRightIcon className="w-6 h-6 text-gray-400" />
    </div>
  );
};
