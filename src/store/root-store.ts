import { createContext } from 'react';

import ProductStore from './product-store';


export class RootStore {
  public productStore: ProductStore;

  constructor() {
    this.productStore = new ProductStore(this);
  }
}

export const Store = new RootStore();

export const Context = createContext<RootStore>(Store);
