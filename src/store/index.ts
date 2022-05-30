import { createStore } from 'vuex';
import weather from './weather';

export const createStoreObj = {
  modules: {
    weather: weather,
  },
};

export default createStore(createStoreObj);
