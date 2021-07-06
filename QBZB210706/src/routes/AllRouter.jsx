import React from "react";
import { Router, Route, Switch } from "dva/router";
import MennuRouter from "../routes/MennuRouter";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/default" component={MennuRouter} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
