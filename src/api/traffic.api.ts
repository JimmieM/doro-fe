import Config from "../config";
import { ITraffic } from "../models/traffic.model";
import axiosApiInstance from "./axios-interceptor";
import { catchError } from "./error-handling";

export class TrafficAPI {
  static GetByLatLng = (lat: number, lng: number) => {
    return axiosApiInstance
      .get<ITraffic[]>(
        `${Config.apiUri}/traffic/position?lat=${lat}&lng=${lng}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((resp) => {
        return resp.data;
      })
      .catch(catchError);
  };
}
