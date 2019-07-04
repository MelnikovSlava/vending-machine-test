import React, { Component } from 'react';

import './ErrorBoundary.less';


interface IErrorBoundaryProps {
  children: any;
}

export default class ErrorBoundary extends Component<IErrorBoundaryProps, any> {
  constructor(props: IErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  }

  render() {
    if (this.state.hasError) {
      return <p className="error-boundary">Something wrong!</p>;
    }

    return this.props.children;
  }
};