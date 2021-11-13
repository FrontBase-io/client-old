import { Grid } from "@mui/material";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
  LayoutItemType,
} from "../../../../../../Utils/Types";

const InterfaceGridItem: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVars: (vars: { [key: string]: InterfaceobjectVariableType }) => void;
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject, setVars }) => {
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
          setVars={setVars}
        />
      ))}
    </Grid>
  );
};

export default InterfaceGridItem;
