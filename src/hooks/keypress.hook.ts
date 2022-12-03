import { useState, useCallback, useEffect } from "react";

export const useKeyPress = (
  keybind: { key: string; combineWith?: string },
  onKeyDownCb: () => void
) => {
  const [previousKeyDownValue, setPreviousKeyDownValue] = useState("");

  const onkeyDown = useCallback(
    (event: any) => {
      const key = event?.key?.toLowerCase();
      if (!keybind.combineWith) {
        if (key === keybind.key) {
          onKeyDownCb();
        }
      } else {
        if (
          previousKeyDownValue === keybind.combineWith &&
          key === keybind.key
        ) {
          onKeyDownCb();
        }
      }

      setPreviousKeyDownValue(key);
    },
    [keybind.combineWith, keybind.key, onKeyDownCb, previousKeyDownValue]
  );

  useEffect(() => {
    document.addEventListener("keydown", onkeyDown, false);

    return () => {
      document.removeEventListener("keydown", onkeyDown, false);
    };
  }, [onkeyDown]);
};
