import { Grid } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import Card from "../../../../Components/Design/Card";
import { AppObjectType } from "../../../../Utils/Types";
import AppIcon from "../AppIcon";

const AppMenu: React.FC<{ apps: AppObjectType[]; closeMenu: () => void }> = ({
  apps,
  closeMenu,
}) => {
  // Vars
  const history = useHistory();

  // Lifecycle

  // UI
  return (
    <Card
      style={{ width: "40vw", height: "30vh" }}
      title="Apps"
      onTitleClick={() => {
        history.push("/");
        closeMenu();
      }}
    >
      <Grid container>
        {apps.map((app) => (
          <Grid item xs={3} key={app._id}>
            <AppIcon app={app} onClick={closeMenu} />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default AppMenu;
