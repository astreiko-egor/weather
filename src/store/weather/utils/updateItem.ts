import { v4 } from 'uuid';
import { IDataWeather, IResponse } from '@/types';

export default (data: IResponse, type: string) => {
  const listInfoItems: IDataWeather[] = [
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
  ];

  return type === 'current'
    ? { data: { id: v4(), listInfoItems } }
    : { id: v4(), city: data.name, listInfoItems };
};
