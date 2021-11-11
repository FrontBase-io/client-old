import { Grid } from "@mui/material";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  LayoutItemType,
} from "../../../../../../Utils/Types";

const InterfaceGridContainer: React.FC<{
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
      container
      direction={layoutItem.args?.direction || "row"}
      justifyContent={layoutItem.args?.justify || "center"}
      alignItems={layoutItem.args?.align || "center"}
      spacing={layoutItem.args?.spacing || 0}
      style={{ width: "100%" }}
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

export default InterfaceGridContainer;