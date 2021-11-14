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
  variables: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVariables: (variables: {
    [key: string]: InterfaceobjectVariableType;
  }) => void;
}> = ({
  variables,
  layoutItem,
  context,
  baseUrl,
  interfaceObject,
  setVariables,
}) => {
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
          variables={variables}
          baseUrl={baseUrl}
          interfaceObject={interfaceObject}
          setVariables={setVariables}
        />
      ))}
    </Grid>
  );
};

export default InterfaceGridContainer;
