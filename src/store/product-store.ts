import { action, observable, runInAction } from 'mobx';

import { axiosInstance } from '../api/api';
import { ICurrency } from './models/currency';
import { IProduct } from './models/product';
import { Stage } from './models/types';
import { RootStore } from './root-store';


export default class ProductStore {
  public rootStore: RootStore;

  @observable public stage: Stage | null;
  @observable public productList: Map<IProduct['id'], IProduct>;
  @observable public currencyList: Map<ICurrency['code'], ICurrency>;
  @observable public baseCurrency: ICurrency | null;
  @observable public selectedProduct: IProduct['id'] | null;
  @observable public isLoading: boolean;
  @observable public error: string | null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    this.stage = null;
    this.productList = new Map();
    this.currencyList = new Map();
    this.baseCurrency = null;
    this.selectedProduct = null;
    this.isLoading = false;
    this.error = null;
  }

  @action('setStage')
  public setStage = (stage: Stage) => {
    this.stage = stage;
  }

  @action('fetchProductInfo')
  public fetchProductInfo = () => {
    const result = axiosInstance.get('/products');
    this.isLoading = true;

    result
      .then((response) => {
        runInAction(() => {
          if (response.status === 200) {
            const { productList, currencyList, baseCurrency } = response.data;

            productList.forEach((product: IProduct) =>
              this.productList.set(product.id, product),
            );

            currencyList.forEach((currency: ICurrency) =>
              this.currencyList.set(currency.code, currency),
            );

            this.baseCurrency = baseCurrency;
            this.stage = 'select';
          }

          this.isLoading = false;
          this.error = null;
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.error = error.toString();
          this.isLoading = false;
        });
      });

    return result;
  }

  @action('selectProduct')
  public selectProduct = (id: IProduct['id']) => {
    const result = axiosInstance.post('/select', { id });

    this.isLoading = true;

    result
      .then((response) => {
        runInAction(() => {
          if (response.status === 200) {
            this.stage = 'buy';
            this.selectedProduct = id;
          }

          this.isLoading = false;
          this.error = null;
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.error = error.toString();
          this.isLoading = false;
        });
      });

    return result;
  }

  @action('buyProduct')
  public buyProduct = (id: IProduct['id'], money: number) => {
    const result = axiosInstance.post('/buy', { id, money });

    this.isLoading = true;

    result
      .then((response) => {
        runInAction(() => {
          if (response.status === 200) {
            this.stage = 'finish';
          }

          this.isLoading = false;
          this.error = null;
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.error = error.toString();
          this.isLoading = false;
        });
      });

    return result;
  }
}
