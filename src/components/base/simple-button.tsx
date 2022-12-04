import classNames from "classnames";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { SimpleSpinner } from "./simple-spinner";

export interface SimpleButtonProps {
  refs?: any;
  onClick?: (
    done?: () => void
  ) => Promise<any> | undefined | null | boolean | void;
  title?: string;
  leftIcon?: any;
  primary?: boolean;
  disabled?: boolean;
  underline?: boolean;
  color?: "gray" | "white" | "red" | "green" | undefined;
  transparent?: boolean;
  noBgOnHover?: boolean;
  children?: JSX.Element | string;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const SimpleButton: FC<SimpleButtonProps> = (props) => {
  const {
    refs,
    onClick,
    title,
    leftIcon,
    primary,
    disabled,
    color,
    children,
    transparent,
    isLoading,
    noBgOnHover,
    underline,
    fullWidth,
  } = props;

  const [isLoadingState, setIsLoadingState] = useState(isLoading);

  const onClickCb = useCallback(() => {
    const click = onClick?.(() => setIsLoadingState(false));

    const isPromise = !!(
      click &&
      typeof click === "object" &&
      typeof click.then === "function"
    );
    isPromise && setIsLoadingState(true);

    isPromise &&
      click
        .then(() => setIsLoadingState(false))
        .catch(() => setIsLoadingState(false));
  }, [onClick]);

  const className = useMemo(
    () =>
      primary
        ? `inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm`
        : `inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-gray-700 ${
            !transparent &&
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
          } sm:text-sm`,
    [primary, transparent]
  );

  const isDisabledMemo = useMemo(
    () => isLoadingState || disabled,
    [disabled, isLoadingState]
  );

  const colorMemo = useMemo(() => {
    if (transparent) return "transparent shadow-none hover:bg-gray-100";

    switch (color) {
      case "white":
        return "bg-white";
      case "gray":
        return "bg-gray-100 hover:bg-gray-200";
      case "red":
        return "bg-red-400 hover:bg-red-500 text-gray-50";
      case "green":
        return "bg-green-500";
      default:
        return "";
    }
  }, [color, transparent]);

  useEffect(() => {
    setIsLoadingState(isLoading);
  }, [isLoading]);

  return (
    <button
      ref={refs}
      disabled={isDisabledMemo}
      onClick={onClickCb}
      type="button"
      className={classNames(
        className,
        colorMemo,
        (noBgOnHover || underline) && "hover:bg-transparent focus:outline-none",
        underline && "hover:underline",
        fullWidth && "w-full"
      )}
    >
      {!isLoadingState ? (
        <>
          {leftIcon && (
            <props.leftIcon
              className={classNames(
                "h-5 w-5 ",
                title && "-ml-1 mr-2",
                !primary && "text-gray-600 hover:text-gray-400"
              )}
              aria-hidden="true"
            />
          )}
          {title || children}
        </>
      ) : (
        <SimpleSpinner size="xs" />
      )}
    </button>
  );
};
