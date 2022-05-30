import {
  IDataWeather,
  IDefaultItem,
  IDefaultItemData,
  IGeoPosition,
  IResponse,
} from '@/types';
import { v4 } from 'uuid';

export default (data: IResponse, type: string, dateAdd?: Date) => {
  const dataItem: IDefaultItemData = {
    id: v4(),
    city: type === 'current' ? data.name + ', ' + data.sys.country : data.name,
    country: type === 'current' ? 'Your current location' : data.sys.country,
    listInfoItems: [
      {
        heading: 'Weather',
        value: data.weather[data.weather.length - 1].main,
      },
      {
        heading: 'Temperature',
        value: data.main.temp + ' °C',
      },
      {
        heading: 'Humidity',
        value: data.main.humidity + ' %',
      },
    ] as IDataWeather[],
    dateAdd: dateAdd || new Date(),
  };
  return type === 'current'
    ? {
        geoPosition: {
          lat: data.coord.lat,
          lng: data.coord.lon,
        } as IGeoPosition,
        data: { ...dataItem },
      }
    : ({
        data: { ...dataItem },
        actions: { isReload: true, isRemove: true },
      } as IDefaultItem);
};
