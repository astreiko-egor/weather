import { IDefaultItem, IState } from '@/types';

export const sortDefaultItemsByDateAdd = (state: IState) => {
  const sortingValue = (a: IDefaultItem, b: IDefaultItem) =>
    new Date(b.data.dateAdd).getTime() - new Date(a.data.dateAdd).getTime();
  return state.defaultItems.sort(sortingValue);
};
