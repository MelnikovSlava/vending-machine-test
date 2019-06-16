import { inject } from 'mobx-react';
import * as React from 'react';
import { Label, Segment } from 'semantic-ui-react';

import { IProduct } from '../../../store/models/product';
import { RootStore } from '../../../store/root-store';

import './ProductItem.less';


interface IProductItemProps {
  product: IProduct;
  rootStore?: RootStore;
}

@inject('rootStore')
export default class ProductItem extends React.Component<IProductItemProps, any> {
  public onSelect = () => {
    const { product: { id }, rootStore: { productStore: { selectProduct } } } = this.props;

    selectProduct(id);
  }

  public render() {
    const { product } = this.props;
    const { baseCurrency } = this.props.rootStore.productStore;

    return (
      <div className="product-item" onClick={this.onSelect}>
        <Segment raised={true}>
          <Label as="a" color="red" ribbon={true}>
            Price: {baseCurrency.symbol}{product.price}
          </Label>
          <span>{product.name}</span>
          <br />
          <br />
          <div className="img-container">
            <img
              className="hidden-base"
              src="https://react.semantic-ui.com/images/wireframe/paragraph.png"
              onLoad={(e) => e.currentTarget.classList.add('visible-base')} />
          </div>
        </Segment>
      </div>
    );
  }
}
