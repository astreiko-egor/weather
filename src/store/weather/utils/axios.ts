import { IGeoPosition } from '@/types';
import axios from 'axios';

export default async (payload: IGeoPosition | string) => {
  let str = '';
  if (typeof payload === 'string') {
    str = `?q=${payload}`;
  }
  if (typeof payload === 'object' && 'lat' in payload && 'lng' in payload) {
    str = `?lat=${payload.lat}&lon=${payload.lng}`;
  }

  return await axios.get(
    `https://api.openweathermap.org/data/2.5/weather${str}&units=metric&appid=eb2152a33d13af0ee4c90afe129ec197`
  );
};
