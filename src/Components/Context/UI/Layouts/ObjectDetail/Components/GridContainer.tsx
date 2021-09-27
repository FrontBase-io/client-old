import { Grid } from "@material-ui/core";
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
