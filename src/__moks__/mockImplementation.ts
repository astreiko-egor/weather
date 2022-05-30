import { parseUrl } from '@/utils';
import { currentPositionItemData, defaultItems } from '@/__moks__';

export default (url: string) => {
  const getParams = parseUrl(url);
  const findCityInQuery = 'q' in getParams;
  const findGeo = 'lon' in getParams && 'lat' in getParams;
  if (!findCityInQuery) {
    if (findGeo) {
      return Promise.resolve(currentPositionItemData);
    }
  } else {
    const findWeatherByCity = defaultItems.find(
      (item) => item.name.toLowerCase() === getParams.q.toLowerCase()
    );
    if (findWeatherByCity) {
      return Promise.resolve({ data: findWeatherByCity });
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        response: {
          data: {
            cod: '400',
            message: 'city not found',
          },
        },
      });
    }
  }
};
