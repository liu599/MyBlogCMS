import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
// import IndexPage from './routes/IndexPage';

import Login from './routes/Login';
import Dashboard from './routes/Dashboard';

const RouterConfig = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        {/* <Route path="/dashboard/:name/:func" component={Dashboard} /> */}
        <Route path="/dashboard" component={Dashboard} />
        {/* <Redirect exact path="/dashboard" to="/dashboard/user-list" /> */}
        <Route path="/login" exact component={Login} />
        <Redirect exact path="/" to="/login" />
        <Route component={() => (<div>Do not directly access this page!</div>)} />
      </Switch>
    </Router>
  );
};

export default RouterConfig;
