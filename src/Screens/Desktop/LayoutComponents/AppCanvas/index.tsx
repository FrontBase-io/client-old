import React from "react";
import { Route, Switch } from "react-router-dom";
import MainDesktop from "../MainDesktop";
import AppLayout from "../../AppLayout";
const AppCanvas: React.FC = () => {
  // Vars

  // Lifecycle

  // UI
  return (
    <Switch>
      <Route path="/:appKey" render={() => <AppLayout />} />
      <Route path="/" component={MainDesktop} />
    </Switch>
  );
};

export default AppCanvas;
