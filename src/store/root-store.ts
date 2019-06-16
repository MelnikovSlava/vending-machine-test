import ProductStore from './product-store';


export class RootStore {
  public productStore: ProductStore;

  constructor() {
    this.productStore = new ProductStore(this);
  }
}

export default new RootStore();
