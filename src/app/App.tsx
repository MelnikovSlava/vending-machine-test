import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Loader } from 'semantic-ui-react';

import { RootStore } from '../store/root-store';
import BuyStage from './buy-stage/BuyStage';
import FinishStage from './finish-stage/FinishStage';
import ProductList from './product-list/ProductList';
import StageBar from './stage-bar/StageBar';

import './App.less';


interface IAppProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
export default class App extends React.Component<IAppProps, any> {
  public componentDidMount() {
    const { fetchProductInfo } = this.props.rootStore.productStore;

    fetchProductInfo();
  }

  public render() {
    const { stage, isLoading, error } = this.props.rootStore.productStore;
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
      <main className="app-container">
        <StageBar />
        <section className="content-container">
          {content}
        </section>
      </main>
    );
  }
}
