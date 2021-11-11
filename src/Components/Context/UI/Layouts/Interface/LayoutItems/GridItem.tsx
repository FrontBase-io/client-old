import { Grid } from "@mui/material";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  LayoutItemType,
} from "../../../../../../Utils/Types";

const InterfaceGridItem: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject }) => {
  // Vars

  // Lifecycle

  // UI

  return (
    <Grid
      item
      xs={layoutItem.args?.xs}
      sm={layoutItem.args?.sm}
      md={layoutItem.args?.md}
      lg={layoutItem.args?.lg}
      xl={layoutItem.args?.xl}
    >
      {(layoutItem.items || []).map((childLayoutItem) => (
        <InterfaceLayoutItem
          context={context}
          layoutItem={childLayoutItem}
          layout={interfaceObject.layout!}
          vars={vars}
          baseUrl={baseUrl}
          interfaceObject={interfaceObject}
        />
      ))}
    </Grid>
  );
};

export default InterfaceGridItem;
