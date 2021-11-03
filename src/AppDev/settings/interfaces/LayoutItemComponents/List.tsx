import { List, ListItem, ListItemText } from "@mui/material";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  SelectOptionType,
} from "../../../../Utils/Types";

const ComponentListPreview: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
}> = ({ context, layoutItem, layout, setLayout, variables }) => {
  // Vars
  const [variableList, setVariableList] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    setVariableList(context.utils.listifyObjectForSelect(variables, "label"));
  }, [context.utils, variables]);

  // UI
  return (
    <>
      <context.UI.Inputs.Select
        label="List items"
        options={variableList}
        value={layoutItem.args?.listItems}
        onChange={async (listItems) => {
          const newLayout = cloneDeep(layout);
          modifyRecursive(newLayout, layoutItem.key!, (item) => {
            const newItem = item;
            newItem!.args = {
              ...(item!.args || {}),
              listItems,
            };
            return newItem;
          });
          setLayout(newLayout);
        }}
      />
      {layoutItem.args?.listItems && (
        <List>
          <ListItem button>
            <ListItemText>
              {variables[layoutItem.args?.listItems].label} item #1
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemText>
              {variables[layoutItem.args?.listItems].label} item #2
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemText>
              {variables[layoutItem.args?.listItems].label} item #3
            </ListItemText>
          </ListItem>
        </List>
      )}
    </>
  );
};

export default ComponentListPreview;
