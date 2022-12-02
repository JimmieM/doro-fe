import {
  FC,
  Fragment,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import { SimpleButton } from "./simple-button";

interface SimpleModalProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | any;
  open: boolean;
  title: string;
  description?: JSX.Element | string;
  content: JSX.Element;
  buttons?: ModalButton[];
  onClose: () => void;
  icon?: any;
}

interface ModalButton {
  disabled?: boolean;
  label: string;
  closeOnClick?: boolean;
  onClick?: (value?: string) => void;
  primary?: boolean;
  hidden?: boolean;
}

export const SimpleModal: FC<SimpleModalProps> = (props) => {
  const { open, title, description, onClose, content, buttons, size } = props;
  const cancelButtonRef = useRef(null);

  const buttonsOnClickMemo = useCallback(
    (button: ModalButton) =>
      button.onClick
        ? () => button.onClick?.()
        : button.closeOnClick
        ? () => onClose()
        : undefined,
    [onClose]
  );

  const buttonsMemo = useMemo(
    () =>
      buttons
        ? buttons.filter((button) => !button.hidden).length > 1
          ? buttons
          : undefined
        : undefined,
    [buttons]
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  `max-w-${size ? size : "lg"}`,
                  !size && "sm:w-full",
                  "relative  bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all sm:my-8  sm:p-6"
                )}
              >
                <div>
                  {props.icon && (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <props.icon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div
                    className={classNames(
                      "text-center mt-3",
                      props.icon && "sm:mt-5"
                    )}
                  >
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    {description && (
                      <div className="mt-2 text-sm text-gray-500">
                        {typeof description !== "string" &&
                        isValidElement(description) ? (
                          description
                        ) : (
                          <p>{description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8">{content}</div>
                <div
                  className={classNames(
                    "mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense text-center",
                    !buttonsMemo ?? buttonsMemo?.length === 1
                      ? "grid-cols-1"
                      : "sm:grid-cols-2 sm:gap-3 "
                  )}
                >
                  {buttonsMemo ? (
                    buttonsMemo.map((button, idx) => (
                      <SimpleButton
                        color={button.closeOnClick ? "gray" : undefined}
                        key={idx}
                        primary={button.primary}
                        disabled={button.disabled}
                        onClick={buttonsOnClickMemo(button)}
                        title={button.label}
                      />
                    ))
                  ) : (
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      onClick={() => onClose()}
                    >
                      Stäng
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
