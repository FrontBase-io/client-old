import { Grid } from "@mui/material";
import { LayoutComponentPropType } from ".";

const GridContainer: React.FC<LayoutComponentPropType> = ({
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
