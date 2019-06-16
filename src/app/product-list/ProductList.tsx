import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { RootStore } from '../../store/root-store';
import ProductItem from './product-item/ProductItem';

import './ProductList.less';


interface IProductListProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
export default class ProductList extends React.Component<IProductListProps, any> {
  public render() {
    const { productList } = this.props.rootStore.productStore;
    let content;

    if (productList.size > 0) {
      content = [];

      productList.forEach((value, key) => {
        content.push(<ProductItem key={key} product={value} />);
      });

    } else {
      content = <p style={{ margin: '50px', fontSize: '20px' }} className="flex">Empty</p>;
    }

    return (
      <div className="product-list">
        {content}
      </div>
    );
  }
}
