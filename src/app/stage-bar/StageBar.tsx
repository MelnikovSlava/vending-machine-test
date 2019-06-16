import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Icon, Step } from 'semantic-ui-react';

import { RootStore } from '../../store/root-store';

import './StageBar.less';


interface IStageBarProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
export default class StageBar extends React.Component<IStageBarProps, any> {
  public render() {
    const { stage } = this.props.rootStore.productStore;

    return (
      <div className="stage-bar">
        <Step.Group size="mini">
          <Step active={stage === 'select'}>
            <Icon name="hand point up" />
            <Step.Content>
              <Step.Title>Select</Step.Title>
            </Step.Content>
          </Step>

          <Step disabled={stage === 'select'} active={stage === 'buy'}>
            <Icon name="payment" />
            <Step.Content>
              <Step.Title>Pay</Step.Title>
            </Step.Content>
          </Step>

          <Step disabled={stage !== 'finish'} active={stage === 'finish'}>
            <Icon name="coffee" />
            <Step.Content>
              <Step.Title>Take it</Step.Title>
            </Step.Content>
          </Step>
        </Step.Group>
      </div>
    );
  }
}
