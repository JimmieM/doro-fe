import { ChevronRightIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { FC, useMemo, useState } from "react";
import { useSearch } from "../../hooks/search.hook";
import { ITraffic } from "../../models/traffic.model";
import { formatDate } from "../../util/date.util";
import { SimpleSearch } from "../base/simple-search";

interface TrafficListProps {
  items: ITraffic[] | undefined;
  onItemClick: (item: ITraffic) => void;
}

export const TrafficList: FC<TrafficListProps> = ({ items, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const trafficItems = useSearch<ITraffic>(
    searchQuery,
    items,
    (trafficItem: ITraffic) => [
      trafficItem.id,
      trafficItem.title,
      trafficItem.description,
      trafficItem.subCategory.toString(),
    ]
  );

  return (
    <div>
      <SimpleSearch value={searchQuery} onChange={setSearchQuery} />
      {trafficItems && trafficItems?.length > 1 ? (
        <ul className="divide-y divide-gray-200 border-b border-gray-200 hover:cursor-pointer">
          {trafficItems.map((item, idx) => (
            <TrafficListItem key={idx} item={item} onItemClick={onItemClick} />
          ))}
        </ul>
      ) : (
        <h2 className="m-6 font-semibold text-sm text-gray-600">
          Inga trafikstörningar hittades.
        </h2>
      )}
    </div>
  );
};

interface TrafficListItemProps {
  onItemClick: (item: ITraffic) => void;
  item: ITraffic;
}

const TrafficListItem: FC<TrafficListItemProps> = ({
  onItemClick,
  item,
}): JSX.Element => {
  const priorityColor = useMemo(() => {
    switch (item.priority) {
      case 1:
        return "green";
      case 2:
        return "orange";
      case 3:
        return "red";
      default:
        return "gray";
    }
  }, [item.priority]);

  return (
    <li
      onClick={() => onItemClick(item)}
      key={item.id}
      className="relative py-5 pl-4 pr-6 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
    >
      <div className="flex items-center justify-between space-x-4">
        <div className="min-w-0 space-y-3">
          <div className="group relative flex items-center space-x-2.5">
            <span
              className={classNames(
                `bg-${priorityColor}-100`,
                "h-4 w-4 rounded-full flex items-center justify-center"
              )}
              aria-hidden="true"
            >
              <span
                className={classNames(
                  `bg-${priorityColor}-400`,
                  "h-2 w-2 rounded-full"
                )}
              />
            </span>
            <span className="truncate text-md font-medium text-gray-500 group-hover:text-gray-900">
              {item.title}
            </span>
          </div>
          <div className="group relative flex items-center space-x-2.5">
            <span className="truncate text-sm font-normal text-gray-500 group-hover:text-gray-900">
              {item.description}
            </span>
          </div>
        </div>
        <div className="sm:hidden">
          <ChevronRightIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <div className="hidden flex-shrink-0 flex-col items-end space-y-3 sm:flex">
          <p className="flex space-x-2 text-sm text-gray-500">
            <span>{formatDate(item.createdDate)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>Sub kategori: {item.subCategory}</span>
            <span aria-hidden="true">&middot;</span>
            <span>Prioritet: {item.priorityString || "N/A"}</span>
          </p>
        </div>
      </div>
    </li>
  );
};
