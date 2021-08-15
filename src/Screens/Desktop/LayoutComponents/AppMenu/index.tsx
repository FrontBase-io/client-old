import { Grid } from "@material-ui/core";
import React from "react";
import Card from "../../../../Components/Design/Card";
import { AppObjectType } from "../../../../Utils/Types";
import App from "../App";

const AppMenu: React.FC<{ apps: AppObjectType[] }> = ({ apps }) => {
  return (
    <Card>
      <Grid container>
        {apps.map((app) => (
          <Grid item xs={3} key={app._id}>
            <App app={app} />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default AppMenu;
