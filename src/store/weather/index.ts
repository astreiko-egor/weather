import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';
import { IState } from '@/types';

export const state = () =>
  ({
    currentPositionItem: {
      geoPosition: {
        lat: 0,
        lng: 0,
      },
      weather: {
        data: {
          id: '',
          city: '',
          country: '',
          listInfoItems: [],
          dateAdd: '',
        },
        actions: {
          isRemove: false,
          isReload: true,
        },
      },
    },
    defaultItems: [],
  } as IState);

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
