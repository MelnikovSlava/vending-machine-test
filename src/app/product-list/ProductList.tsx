import { observer } from 'mobx-react';
import React, { Component } from 'react';

import { Context, RootStore } from '../../store/root-store';
import ProductItem from './product-item/ProductItem';

import './ProductList.less';


@observer
export default class ProductList extends Component<any, any> {
  public static contextType = Context;

  public render() {
    const { productStore: { productList } } = this.context as RootStore;
    let content;

    if (productList.size > 0) {
      content = [];

      productList.forEach((value, key) => {
        content.push(<ProductItem key={key} product={value} />);
      });

    } else {
      content = <p className="product-list--empty flex">Empty</p>;
    }

    return <div className="product-list">{content}</div>;
  }
}
