import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface SimpleSearchProps {
  title?: string;
  placeholder?: string;
  value?: any;
  onChange?: (value: any) => void;
  _ref: any;
}

export const SimpleSearch: FC<SimpleSearchProps> = ({
  title,
  placeholder,
  value,
  onChange,
  _ref,
}) => {
  return (
    <div>
      {title && (
        <label
          htmlFor="input"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {title}
        </label>
      )}
      <div className=" relative rounded-md shadow-sm">
        <input
          ref={_ref}
          value={value}
          onChange={({ target }) => onChange?.(target.value)}
          type="text"
          name="input"
          id="input"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300"
          placeholder={placeholder || "Sök ..."}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
