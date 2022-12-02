import { FC, useMemo } from "react";
import { ITraffic } from "../../models/traffic.model";
import { formatDate } from "../../util/date.util";
import { SimpleButton } from "../base/simple-button";
import { SimpleCard } from "../base/simple-card";
import { SimpleModal } from "../base/simple-modal";

interface TrafficDetailsModalProps {
  item: ITraffic;
  onClose: () => void;
  showOnMap: (item: ITraffic) => void;
}

export const TrafficDetailsModal: FC<TrafficDetailsModalProps> = ({
  item,
  onClose,
  showOnMap,
}) => {
  const cardDataMemo = useMemo(
    () => [
      {
        label: "Kategori",
        value: item.category.toString(),
      },
      {
        label: "Subkategori",
        value: item.subCategory.toString(),
      },
      {
        label: "Datum",
        value: formatDate(item.createdDate),
      },
      {
        label: "Prioritet",
        value: item.priorityString,
      },
    ],
    [item.category, item.createdDate, item.priorityString, item.subCategory]
  );

  const contentMemo = useMemo(
    () => (
      <div className="m-4">
        <h3 className="font-normal text-gray-600 text-md">
          {item.description}
        </h3>

        <div className="mt-4 flex justify-end">
          <SimpleButton
            fullWidth
            color="gray"
            title="Visa på karta"
            onClick={() => showOnMap(item)}
          />
        </div>
        <div className="mt-10">
          <p className="font-semibold text-gray-500 mb-4">Mer information</p>
          <SimpleCard items={cardDataMemo} />
        </div>
      </div>
    ),

    [cardDataMemo, item, showOnMap]
  );

  const buttonsMemo = useMemo(
    () => [{ label: "Stäng", closeOnClick: true }],
    []
  );

  return (
    <SimpleModal
      size="sm"
      title={item.title}
      onClose={onClose}
      open={!!item}
      content={contentMemo}
      buttons={buttonsMemo}
    />
  );
};
