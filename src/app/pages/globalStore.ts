import { create } from "zustand";

type StoreState<T> = {
  datas: T[];
  setDatasStore: (newData: T[]) => void;
  addStore: (data: T) => void;
  removeStore: (predicate: (data: T) => boolean) => void;
  updateStore: (predicate: (data: T) => boolean, newData: Partial<T>) => void;
};

export const createStore = <T>() =>
  create<StoreState<T>>((set) => ({
    datas: [],
    setDatasStore: (newData) => set({ datas: newData }),
    addStore: (data) => set((state) => ({ datas: [...state.datas, data] })),
    removeStore: (predicate) =>
      set((state) => ({
        datas: state.datas.filter((data) => !predicate(data)),
      })),
    updateStore: (predicate, newData) =>
      set((state) => ({
        datas: state.datas.map((data) =>
          predicate(data) ? { ...data, ...newData } : data
        ),
      })),
  }));
