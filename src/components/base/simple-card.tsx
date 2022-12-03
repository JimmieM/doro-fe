import { FC, useCallback, useMemo, useState } from "react";
import { SimpleButton } from "./simple-button";

interface SimpleCardProps {
  title?: string;
  description?: string;
  items: CardItem[];
  onSave?: () => void;
}

interface CardItem {
  label: string;
  value: string | JSX.Element;
  onChange?: (val: string) => void;
  disabled?: boolean;
  hidden?: boolean;
}

export const SimpleCard: FC<SimpleCardProps> = ({
  title,
  description,
  items,
  onSave,
}) => {
  const filteredItems = useMemo(
    () => items.filter((item) => !!item && !item.hidden),
    [items]
  );

  const canEdit = useMemo(() => items.find((item) => !!item.onChange), [items]);

  const [editMode, setEditMode] = useState(false);

  const onActivateEditClick = useCallback(() => {
    setEditMode(true);
  }, []);

  const onDeactivateEditClick = useCallback(() => {
    setEditMode(false);
  }, []);

  const onSaveClick = useCallback(() => {
    onDeactivateEditClick();
    onSave?.();
  }, [onDeactivateEditClick, onSave]);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="flex justify-between">
        {title && (
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>

            {description && (
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
        )}
        {canEdit && (
          <div className="self-center mr-4 flex space-x-2">
            {!editMode ? (
              <SimpleButton
                primary
                title="Redigera"
                onClick={onActivateEditClick}
              />
            ) : (
              <>
                <SimpleButton
                  color="gray"
                  title="Avbryt"
                  onClick={onDeactivateEditClick}
                />
                <SimpleButton primary title="Spara" onClick={onSaveClick} />
              </>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt className="text-sm font-medium text-gray-500">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
