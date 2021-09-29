import { Grid } from "@mui/material";
import { AppContext } from "../../../..";

const GridContainer: React.FC<{ context: AppContext }> = ({
  context,
  children,
}) => {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
};

export default GridContainer;
