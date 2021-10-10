import { Grid } from "@mui/material";
import { LayoutComponentPropType } from ".";

const GridItem: React.FC<LayoutComponentPropType> = ({
  context,
  children,
  layoutItem,
}) => {
  return (
    <Grid
      item
      xs={layoutItem.args?.xs}
      sm={layoutItem.args?.sm}
      md={layoutItem.args?.md}
      lg={layoutItem.args?.lg}
      xl={layoutItem.args?.xl}
    >
      {children}
    </Grid>
  );
};

export default GridItem;
