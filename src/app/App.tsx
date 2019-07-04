import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';

import { Context, RootStore } from '../store/root-store';
import BuyStage from './buy-stage/BuyStage';
import FinishStage from './finish-stage/FinishStage';
import ProductList from './product-list/ProductList';
import StageBar from './stage-bar/StageBar';

import './App.less';


@observer
export default class App extends Component<any, any> {
  public static contextType = Context;

  public componentDidMount() {
    const { productStore: { fetchProductInfo } } = this.context as RootStore;

    fetchProductInfo();
  }

  public render() {
    const { productStore: { stage, isLoading, error } } = this.context;
    let content;

    if (isLoading) {
      content = <Loader size="massive" active={true}>Loading</Loader>;

    } else if (error !== null) {
      content = <p>Something wrong!</p>;

    } else {
      switch (stage) {
        case 'select':
          content = <ProductList />;
          break;

        case 'buy':
          content = <BuyStage />;
          break;

        case 'finish':
          content = <FinishStage />;
          break;

        default:
          content = null;
          break;
      }
    }

    return (
      <main className="app">
        <StageBar />
        <section className="app--content">{content}</section>
      </main>
    );
  }
}
