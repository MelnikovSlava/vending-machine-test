import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';

import App from './app/App';
import { Context, Store } from './store/root-store';

import './index.less';


class Container extends React.Component<any, any> {
  public render() {
    return (
      // disable, because semanticUI contain deprecated lifecycle methods
      // <React.StrictMode>
      <Context.Provider value={Store}>
        <App />
      </Context.Provider>
      // </React.StrictMode>
    );
  }
}

hot(Container);

ReactDOM.render(<Container />, document.getElementById('root'));
