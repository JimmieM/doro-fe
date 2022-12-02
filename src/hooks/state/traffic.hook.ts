import create from "zustand";
import { TrafficAPI } from "../../api/traffic.api";
import { ITraffic } from "../../models/traffic.model";

type TrafficState = {
  items: ITraffic[] | undefined;
  viewedItems: ITraffic[];
  getByLatLng: (lat: number, lng: number) => Promise<ITraffic[] | undefined>;
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
      const items = await TrafficAPI.GetByLatLng(lat, lng);
      if (!items) return undefined;

      set({ items });
      return items;
    },
  };
});
