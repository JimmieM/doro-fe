export interface ITraffic {
  id: string;
  trafficId: string;
  priority: number;
  priorityString: string;
  createdDate: Date;
  title: string;
  exactLocation: any;
  description: string;
  latitude: number;
  longitude: number;
  category: number;
  subCategory: number;
}

export interface ITrafficAreaResponse {
  messages: ITraffic[];
  city: string;
}
