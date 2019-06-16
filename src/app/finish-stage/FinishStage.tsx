import { inject } from 'mobx-react';
import * as React from 'react';
import { Button, Header } from 'semantic-ui-react';

import { RootStore } from '../../store/root-store';

import './FinishStage.less';


interface IFinishStageProps {
  rootStore?: RootStore;
}

@inject('rootStore')
export default class FinishStage extends React.Component<IFinishStageProps, any> {
  private ref: HTMLDivElement;

  public onClick = () => {
    const { setStage } = this.props.rootStore.productStore;

    this.ref.classList.add('finish-screen-close');

    setStage('select');
  }

  public render() {
    return (
      <div ref={(ref) => this.ref = ref} className="finish-screen flex-col-base hidden-base">
        <Header as="h1">Take it!</Header>
        <div className="finish-screen--img-container">
          <img
            src="https://img.icons8.com/color/1600/coffee-to-go.png"
            alt="coffee"
            onLoad={() => this.ref.classList.add('visible-base')} />
        </div>
        <Button.Group className="finish-screen--btn">
          <Button
            color="green"
            size="large"
            fluid={true}
            onClick={this.onClick}
          >Ok</Button>
        </Button.Group>
      </div>
    );
  }
}
