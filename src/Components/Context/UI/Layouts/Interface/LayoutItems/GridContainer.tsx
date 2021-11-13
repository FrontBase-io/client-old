import { Grid } from "@mui/material";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
  LayoutItemType,
} from "../../../../../../Utils/Types";

const InterfaceGridContainer: React.FC<{
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
          setVars={setVars}
        />
      ))}
    </Grid>
  );
};

export default InterfaceGridContainer;
