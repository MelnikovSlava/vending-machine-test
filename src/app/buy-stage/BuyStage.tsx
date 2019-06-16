import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Button, Checkbox, Form, Label } from 'semantic-ui-react';

import { ICurrency } from '../../store/models/currency';
import { RootStore } from '../../store/root-store';

import './BuyStage.less';


interface IBuyStageProps {
  rootStore?: RootStore;
}

interface IBuyStageState {
  currency: null | ICurrency['code'];
}

@inject('rootStore')
@observer
export default class BuyStage extends React.Component<IBuyStageProps, IBuyStageState> {
  constructor(props: Readonly<IBuyStageProps> | any) {
    super(props);

    this.state = {
      currency: props.rootStore.productStore.baseCurrency.code,
    };
  }

  public currencyChange = (e, { value }) => {
    this.setState({ currency: value });
  }

  public pay = () => {
    const { selectedProduct, buyProduct } = this.props.rootStore.productStore;

    buyProduct(selectedProduct, 10);
  }

  public render() {
    const { selectedProduct, productList, setStage, currencyList } = this.props.rootStore.productStore;
    const { currency } = this.state;

    const product = productList.get(selectedProduct);
    const currencyObj = currencyList.get(currency);
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
            checked={this.state.currency === key}
            onChange={this.currencyChange}
          />
        </Form.Field>,
      ));

    return (
      <div className="buy-stage flex-col">
        <section className="buy-stage--info">
          <p className="buy-stage--text">{product.name}</p>
          <Label as="a" tag={true}>{currencyObj.symbol} {price}</Label>
        </section>

        <Form className="buy-stage--currency">
          {radioBtns}
        </Form>

        <Button.Group size="huge" fluid={true}>
          <Button color="teal" onClick={this.pay}>Pay</Button>
          <Button.Or />
          <Button onClick={() => setStage('select')}>Back</Button>
        </Button.Group>
      </div>
    );
  }
}
