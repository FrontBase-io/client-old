import {
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  Tooltip,
} from "@mui/material";
import { cloneDeep, find, map } from "lodash";
import { useEffect, useState } from "react";
import LayoutItemComponent from ".";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
  SelectOptionType,
} from "../../../../Utils/Types";
import DropTarget from "../DropTarget";

const ComponentListPreview: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelList: ModelType[];
  modelListOptions: SelectOptionType[];
}> = ({
  context,
  layoutItem,
  layout,
  setLayout,
  variables,
  modelList,
  modelListOptions,
}) => {
  // Vars
  const [variableList, setVariableList] = useState<SelectOptionType[]>([]);
  const [fieldList, setFieldList] = useState<SelectOptionType[]>([]);
  const [settingsAnchor, setSettingsAnchor] =
    useState<HTMLButtonElement | null>();

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
      <Popover
        id="settings-popover"
        open={Boolean(settingsAnchor)}
        anchorEl={settingsAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => setSettingsAnchor(null)}
      >
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
          <context.UI.Inputs.Select
            label="Secondary field"
            options={fieldList}
            value={layoutItem.args?.secondaryField}
            onChange={async (secondaryField) => {
              const newLayout = cloneDeep(layout);
              modifyRecursive(newLayout, layoutItem.key!, (item) => {
                const newItem = item;
                newItem!.args = {
                  ...(item!.args || {}),
                  secondaryField,
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
      </Popover>
      <div style={{ margin: 10, textAlign: "right" }}>
        <Tooltip
          placement="bottom"
          title={
            Boolean(settingsAnchor)
              ? "Close layout settings"
              : "Edit layout settings"
          }
        >
          <IconButton onClick={(e) => setSettingsAnchor(e.currentTarget)}>
            <context.UI.Design.Icon
              icon={Boolean(settingsAnchor) ? "times-circle" : "wrench"}
              size={18}
            />
          </IconButton>
        </Tooltip>
      </div>

      {layoutItem.args?.listItems && (
        <List disablePadding style={{ marginTop: 15 }}>
          <ListItem>
            <ListItemAvatar style={{ maxWidth: 120, overflowX: "auto" }}>
              <DropTarget
                id={layoutItem.key!}
                layout={layout}
                setLayout={setLayout}
                mini
                single
                onDrop={(avatarElement) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(newLayout, layoutItem.key!, (item) => {
                    const newItem = item;
                    newItem!.args = {
                      ...(item!.args || {}),
                      avatarElement,
                    };
                    return newItem;
                  });
                  setLayout(newLayout);
                }}
                accepts={["InputBoolean"]}
              >
                {layoutItem.args?.avatarElement && (
                  <LayoutItemComponent
                    layoutItem={layoutItem.args?.avatarElement}
                    context={context}
                    key={`layoutItem-avatar`}
                    layout={layout || []}
                    setLayout={setLayout}
                    modelList={modelList}
                    variables={{
                      ...variables,
                      currentListItem: {
                        label: "Current list item",
                        type: "object",
                      },
                    }}
                    modelListOptions={modelListOptions}
                  />
                )}
              </DropTarget>
            </ListItemAvatar>
            <ListItemText>
              {variables[layoutItem.args?.listItems].label}{" "}
              {layoutItem.args?.labelField || "item"}
            </ListItemText>
            <ListItemSecondaryAction>
              <DropTarget
                id={layoutItem.key!}
                layout={layout}
                setLayout={setLayout}
                mini
              ></DropTarget>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      )}
    </>
  );
};

export default ComponentListPreview;
