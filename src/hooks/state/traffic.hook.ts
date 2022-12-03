import create from "zustand";
import { TrafficAPI } from "../../api/traffic.api";
import { ITraffic, ITrafficAreaResponse } from "../../models/traffic.model";

type TrafficState = {
  items: ITraffic[] | undefined;
  viewedItems: ITraffic[];
  getByLatLng: (
    lat: number,
    lng: number
  ) => Promise<ITrafficAreaResponse | undefined>;
  addToViewedlist(item: ITraffic): void;
  clearViewedList(): void;
};

export const useTraffic = create<TrafficState>((set, get) => {
  return {
    items: undefined,
    viewedItems: [],
    clearViewedList() {
      set({ viewedItems: [] });
    },
    addToViewedlist(item: ITraffic) {
      const exists = get().viewedItems.find((it) => it.id === item.id);
      if (!!exists) return;
      set({ viewedItems: [...get().viewedItems, item] });
    },
    async getByLatLng(lat: number, lng: number) {
      const response = await TrafficAPI.GetByLatLng(lat, lng);
      if (!response) return undefined;

      set({ items: response.messages });
      return response;
    },
  };
});
