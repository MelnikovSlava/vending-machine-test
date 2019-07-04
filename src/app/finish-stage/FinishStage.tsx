import React, { Component, createRef } from 'react';
import { Button, Header } from 'semantic-ui-react';

import { Context, RootStore } from '../../store/root-store';

import './FinishStage.less';


export default class FinishStage extends Component<any, any> {
  public static contextType = Context;
  private ref = createRef<HTMLDivElement>();

  public onClick = () => {
    const { productStore: { setStage } } = this.context as RootStore;

    this.ref.current.classList.add('finish-screen--close');

    setStage('select');
  }

  public loadImg() {
    this.ref.current.classList.add('visible-base');
  }

  public render() {
    return (
      <div ref={this.ref} className="finish-screen flex-col-base hidden-base">
        <Header as="h1">Take it!</Header>

        <div className="finish-screen--img-container">
          <img
            src="https://img.icons8.com/color/1600/coffee-to-go.png"
            alt="coffee"
            onLoad={this.loadImg}
          />
        </div>

        <Button.Group className="finish-screen--btn">
          <Button
            color="green"
            size="large"
            fluid={true}
            onClick={this.onClick}
          >
            Ok
          </Button>
        </Button.Group>
      </div>
    );
  }
}
