import create from "zustand";
import { LatLng } from "../../models/position.model";

type CurrentPositionState = {
  position: LatLng | undefined;
  city: string | undefined;
  setPosition: (position: LatLng) => void;
  setCity: (city: string) => void;
};

export const useCurrentPosition = create<CurrentPositionState>((set) => {
  return {
    position: undefined,
    city: undefined,
    setPosition(position: LatLng) {
      set({ position });
    },
    setCity(city: string) {
      set({ city });
    },
  };
});
