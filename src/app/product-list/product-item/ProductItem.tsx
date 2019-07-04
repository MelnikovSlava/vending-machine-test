import React, { Component } from 'react';
import { Label, Segment } from 'semantic-ui-react';

import { IProduct } from '../../../store/models/product';
import { Context, RootStore } from '../../../store/root-store';

import './ProductItem.less';


interface IProductItemProps {
  product: IProduct;
}

export default class ProductItem extends Component<IProductItemProps, any> {
  public static contextType = Context;

  public onSelect = () => {
    const { productStore: { selectProduct } } = this.context as RootStore;
    const { product: { id } } = this.props;

    selectProduct(id);
  }

  public render() {
    const { product } = this.props;
    const { productStore: { baseCurrency } } = this.context;

    return (
      <div className="product-item" onClick={this.onSelect}>
        <Segment raised={true}>

          <Label as="a" color="red" ribbon={true}>
            Price: {baseCurrency.symbol}{product.price}
          </Label>

          <span>{product.name}</span>
          <br />
          <br />

          <div className="product-item--img">
            <img
              className="hidden-base"
              src="https://react.semantic-ui.com/images/wireframe/paragraph.png"
              onLoad={(e) => e.currentTarget.classList.add('visible-base')}
            />
          </div>

        </Segment>
      </div>
    );
  }
}
