import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app'

async function render() {
  ReactDOM.render(<App />, document.getElementById('App'));
}

render();
