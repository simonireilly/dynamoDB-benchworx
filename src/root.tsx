import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./pages/app";

async function render() {
  ReactDOM.render(<App />, document.getElementById("App"));
}

render();
