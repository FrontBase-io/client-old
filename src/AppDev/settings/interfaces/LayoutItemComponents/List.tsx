import {
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { cloneDeep, find, map } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
  SelectOptionType,
} from "../../../../Utils/Types";

const ComponentListPreview: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelList: ModelType[];
}> = ({ context, layoutItem, layout, setLayout, variables, modelList }) => {
  // Vars
  const [variableList, setVariableList] = useState<SelectOptionType[]>([]);
  const [fieldList, setFieldList] = useState<SelectOptionType[]>([]);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(
    layoutItem.args ? false : true
  );

  // Lifecycle
  useEffect(() => {
    setVariableList(context.utils.listifyObjectForSelect(variables, "label"));
  }, [context.utils, variables]);
  useEffect(() => {
    layoutItem.args?.listItems &&
      setFieldList(
        context.utils.listifyObjectForSelect(
          find(
            modelList,
            (o) => o.key === variables[layoutItem.args?.listItems].model
          )?.fields || {},
          "label"
        )
      );
  }, [layoutItem.args]);
  // UI
  return (
    <>
      <span style={{ float: "right" }}>
        <Tooltip
          placement="bottom"
          title={settingsOpen ? "Close list settings" : "Edit list settings"}
        >
          <IconButton onClick={() => setSettingsOpen(!settingsOpen)}>
            <context.UI.Design.Icon
              icon={settingsOpen ? "times-circle" : "wrench"}
              size={15}
            />
          </IconButton>
        </Tooltip>
      </span>
      <Collapse in={settingsOpen}>
        <Divider />
        <div style={{ padding: 15 }}>
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
          <context.UI.Inputs.Select
            label="Label field"
            options={fieldList}
            value={layoutItem.args?.labelField}
            onChange={async (labelField) => {
              const newLayout = cloneDeep(layout);
              modifyRecursive(newLayout, layoutItem.key!, (item) => {
                const newItem = item;
                newItem!.args = {
                  ...(item!.args || {}),
                  labelField,
                };
                return newItem;
              });
              setLayout(newLayout);
            }}
          />
          {layoutItem.args?.listItems && (
            <context.UI.Objects.Designer
              context={context}
              model={
                find(
                  modelList,
                  (o) => o.key === variables[layoutItem.args?.listItems].model
                )!
              }
              withFormula
              value={layoutItem.args?.filter || {}}
              onChange={(filter) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    filter,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          )}
        </div>
        <Divider />
      </Collapse>
      {layoutItem.args?.listItems && (
        <List disablePadding style={{ marginTop: 15 }}>
          <ListItem button>
            <ListItemText>
              {variables[layoutItem.args?.listItems].label}{" "}
              {layoutItem.args?.labelField || "item"} #1
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemText>
              {variables[layoutItem.args?.listItems].label}{" "}
              {layoutItem.args?.labelField || "item"} #2
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemText>
              {variables[layoutItem.args?.listItems].label}{" "}
              {layoutItem.args?.labelField || "item"} #3
            </ListItemText>
          </ListItem>
        </List>
      )}
    </>
  );
};

export default ComponentListPreview;
