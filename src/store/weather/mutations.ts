import {
  IState,
  IDefaultItemData,
  IDataWeather,
  IDefaultItem,
  IGeoPosition,
} from '@/types';
export const receiveWeatherCurrentPositionItem = (
  state: IState,
  payload: {
    geoPosition?: IGeoPosition;
    data: IDefaultItemData;
  }
) => {
  if (payload.geoPosition) {
    state.currentPositionItem.geoPosition = payload.geoPosition;
  }
  state.currentPositionItem.weather.data = payload.data;
};

export const updateWeatherCurrentPositionItem = (
  state: IState,
  payload: { id: string; listInfoItems: IDataWeather[] }
) => {
  state.currentPositionItem.weather.data.id = payload.id;
  state.currentPositionItem.weather.data.listInfoItems = payload.listInfoItems;
};

export const receiveWeatherDefaultItem = (
  state: IState,
  payload: IDefaultItem
) => {
  state.defaultItems.push(payload);
};

export const updateWeatherDefaultItem = (
  state: IState,
  payload: { id: string; city: string; listInfoItems: IDataWeather[] }
) => {
  const findItem = state.defaultItems.find(
    (item: IDefaultItem) =>
      item.data.city.toLowerCase() === payload.city.toLowerCase()
  );
  if (findItem) {
    findItem.data.id = payload.id;
    findItem.data.listInfoItems = payload.listInfoItems;
  }
};

export const removeDefaultItem = (state: IState, payload: IDefaultItem[]) => {
  state.defaultItems = payload;
};
