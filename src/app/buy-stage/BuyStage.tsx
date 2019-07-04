import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Button, Checkbox, Form, Label } from 'semantic-ui-react';

import { ICurrency } from '../../store/models/currency';
import { Context, RootStore } from '../../store/root-store';

import './BuyStage.less';


interface IBuyStageState {
  currency: null | ICurrency['code'];
}

@observer
export default class BuyStage extends Component<any, IBuyStageState> {
  public static contextType = Context;

  public currencyChange = (e, { value }) => {
    this.setState({ currency: value });
  }

  public pay = () => {
    const { productStore: { selectedProduct, buyProduct } } = this.context as RootStore;

    buyProduct(selectedProduct, 10);
  }

  public goToBack = () => {
    const { productStore: { setStage } } = this.context as RootStore;

    setStage('select');
  }

  public render() {
    const {
      productStore: {
        selectedProduct,
        productList,
        currencyList,
        baseCurrency,
      } } = this.context as RootStore;

    const product = productList.get(selectedProduct);
    const currencyObj = currencyList.get(baseCurrency.code);
    const price = (currencyObj.ratio * product.price).toFixed(2);

    const radioBtns = [];

    currencyList.forEach((value, key) =>
      radioBtns.push(
        <Form.Field key={key}>
          <Checkbox
            radio={true}
            label={key}
            name="checkboxRadioGroup"
            value={key}
            checked={baseCurrency.code === key}
            onChange={this.currencyChange}
          />
        </Form.Field>,
      ),
    );

    return (
      <div className="buy-stage flex-col">
        <section className="buy-stage--info">
          <p className="buy-stage--text">{product.name}</p>
          <Label as="a" tag={true}>{currencyObj.symbol} {price}</Label>
        </section>

        <Form className="buy-stage--currency">{radioBtns}</Form>

        <Button.Group size="huge" fluid={true}>
          <Button color="teal" onClick={this.pay}>Pay</Button>
          <Button.Or />
          <Button onClick={this.goToBack}>Back</Button>
        </Button.Group>
      </div>
    );
  }
}
