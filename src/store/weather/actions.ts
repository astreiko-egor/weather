import { IState, IGeoPosition, IDefaultItem, IResponseError } from '@/types';
import { ActionContext } from 'vuex';
import { axios, createItem, updateItem } from './utils';

export const loadWeatherCurrentPositionItemFromTheStorage = ({
  commit,
}: ActionContext<IState, IState>) => {
  const sessionStorageData = JSON.parse(
    sessionStorage.getItem('currentPositionItem') || '{}'
  );
  if ('lat' in sessionStorageData && 'lng' in sessionStorageData) {
    axios({
      lat: sessionStorageData.lat,
      lng: sessionStorageData.lng,
    } as IGeoPosition).then(({ data }) => {
      commit(
        'receiveWeatherCurrentPositionItem',
        createItem(data, 'current', sessionStorage.dateAdd)
      );
    });
  }
};
export const loadWeatherCurrentPositionItem = (
  { commit }: ActionContext<IState, IState>,
  payload: { geoPosition: IGeoPosition; type: string }
) => {
  axios({
    lat: payload.geoPosition.lat,
    lng: payload.geoPosition.lng,
  } as IGeoPosition).then(({ data }) => {
    if (payload.type === 'create') {
      commit('receiveWeatherCurrentPositionItem', createItem(data, 'current'));
      sessionStorage.setItem(
        'currentPositionItem',
        JSON.stringify({
          lat: payload.geoPosition.lat,
          lng: payload.geoPosition.lng,
          dateAdd: new Date(),
        })
      );
    } else if (payload.type === 'update') {
      commit('updateWeatherCurrentPositionItem', updateItem(data, 'current'));
    }
  });
};

export const loadWeatherDefaultItemsForTheStorage = async ({
  commit,
}: ActionContext<IState, IState>) => {
  const sessionStorageData = JSON.parse(
    sessionStorage.getItem('defaultItems') || '[]'
  );
  sessionStorageData.forEach(async (item: { city: string; dateAdd: Date }) => {
    await axios(item.city).then(({ data }) => {
      commit(
        'receiveWeatherDefaultItem',
        createItem(data, 'default', sessionStorage.dateAdd)
      );
    });
  });
};
export const loadWeatherDefaultItem = async (
  { state, commit }: ActionContext<IState, IState>,
  payload: {
    city: string;
    type: string;
  }
) => {
  await new Promise((resolve, reject) => {
    axios(payload.city)
      .then(({ data }) => {
        if (payload.type === 'create') {
          const searchDuplicates = state.defaultItems.find(
            (item: IDefaultItem) =>
              item.data.city.toLowerCase() === data.name.toLowerCase()
          );

          if (!searchDuplicates) {
            resolve(updateItem(data, 'default'));
            commit('receiveWeatherDefaultItem', createItem(data, 'default'));
            const sessionStorageData = JSON.parse(
              sessionStorage.getItem('defaultItems') || '[]'
            );
            sessionStorage.setItem(
              'defaultItems',
              JSON.stringify([
                ...sessionStorageData,
                { city: data.name, dateAdd: new Date() },
              ])
            );
          } else {
            reject(new Error('The city is already on the list'));
          }
        } else {
          commit('updateWeatherDefaultItem', updateItem(data, 'default'));
        }
      })
      .catch((error: IResponseError) => {
        reject(new Error(error.response?.data.message));
      });
  });
};
export const removeDefaultItem = (
  { state, commit }: ActionContext<IState, IState>,
  city: string
) => {
  const newStateArray = state.defaultItems.filter(
    (item: IDefaultItem) => item.data.city.toLowerCase() !== city.toLowerCase()
  );
  const sessionStorageData = JSON.parse(
    sessionStorage.getItem('defaultItems') as string
  );
  const newSessionStorageArray = sessionStorageData.filter(
    (item: { city: string }) => item.city.toLowerCase() !== city.toLowerCase()
  );

  commit('removeDefaultItem', newStateArray);
  sessionStorage.setItem('defaultItems', newSessionStorageArray);
};
