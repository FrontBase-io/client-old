import { Grid } from "@material-ui/core";
import { AppContext } from "../../../..";
import { LayoutItemType } from "../../../../../../Utils/Types";

const GridItem: React.FC<{ context: AppContext; layoutItem: LayoutItemType }> =
  ({ context, children, layoutItem }) => {
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
