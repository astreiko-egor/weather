export interface IDataWeather {
  heading: string;
  value: string;
}

export interface IDefaultItemData {
  id: string;
  city: string;
  country: string;
  listInfoItems: IDataWeather[];
  dateAdd: string | Date;
}

export interface IDefaultItemActions {
  isRemove: boolean;
  isReload: boolean;
}

export interface IGeoPosition {
  lat: number | null;
  lng: number | null;
}

export interface IDefaultItem {
  data: IDefaultItemData;
  actions: IDefaultItemActions;
}

export interface ICurrentPositionItem {
  geoPosition: IGeoPosition;
  weather: IDefaultItem;
}

export interface IState {
  weather?: IState;
  currentPositionItem: ICurrentPositionItem;
  defaultItems: IDefaultItem[];
}

export interface IResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: 'stations';
  main: {
    temp: number;
    // eslint-disable-next-line camelcase
    feels_like: number;
    // eslint-disable-next-line camelcase
    temp_min: number;
    // eslint-disable-next-line camelcase
    temp_max: number;
    pressure: number;
    humidity: number;
    // eslint-disable-next-line camelcase
    sea_level: number;
    // eslint-disable-next-line camelcase
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface IResponseError {
  response: {
    data: {
      message: string;
    };
  };
}
