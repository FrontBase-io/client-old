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
          variables={variables}
          baseUrl={baseUrl}
          interfaceObject={interfaceObject}
          setVariables={setVariables}
        />
      ))}
    </Grid>
  );
};

export default InterfaceGridItem;
