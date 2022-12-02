import { useEffect, useState } from "react";
import { usePrevious } from "./previous.hook";

export const useSearch = <T>(
  searchStr: string,
  list: T[] | undefined,
  find: (item: T) => (string | undefined)[],
  emptyIfNoQuery?: boolean
) => {
  const prevList = usePrevious(list);
  const [res, setRes] = useState(list);
  const prevSearchStr = usePrevious(searchStr);

  useEffect(() => {
    const match = (val?: string) =>
      val?.toLowerCase().includes(searchStr.toLowerCase());

    if (searchStr !== "" && searchStr !== prevSearchStr && list) {
      setRes(
        list.filter((d) =>
          find(d)
            .map((val) => match(val))
            .find((e) => !!e)
        )
      );
    }
    if ((!searchStr || searchStr === "") && !emptyIfNoQuery) {
      setRes(list);
    }
    if ((!searchStr || searchStr === "") && emptyIfNoQuery) {
      setRes([]);
    }
    if (list !== prevList) {
      if ((!searchStr || searchStr === "") && !emptyIfNoQuery) setRes(list);
      if (searchStr !== "" && emptyIfNoQuery && list)
        setRes(
          list.filter((d) =>
            find(d)
              .map((val) => match(val))
              .find((e) => !!e)
          )
        );
    }
  }, [emptyIfNoQuery, find, list, prevList, prevSearchStr, searchStr]);
  return res;
};
