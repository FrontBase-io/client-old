import React from "react";
import Card from "../../Components/Design/Card";
import { Animate } from "../../Components/Design/Animations";
import { Grid } from "@mui/material";

const HomeScreen: React.FC = () => {
  return (
    <Animate>
      <Grid container>
        <Grid item xs={4}>
          <Card title="Home page">
            This will soon be a nice grid of widgets.
          </Card>
        </Grid>
      </Grid>
    </Animate>
  );
};

export default HomeScreen;
