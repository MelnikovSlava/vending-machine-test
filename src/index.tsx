import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';

import App from './app/App';
import RootStore from './store/root-store';

import './index.less';


class Container extends React.Component<any, any> {
  private renderDevTool = () => {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default;
      return <DevTools />;
    }
  }

  public render() {
    return (
      <Provider rootStore={RootStore}>
        <div>
          <App />
          {this.renderDevTool()}
        </div>
      </Provider>
    );
  }
}

hot(module)(Container);

ReactDOM.render(<Container />, document.getElementById('root'));
