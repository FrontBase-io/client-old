import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip,
} from "@mui/material";
import { cloneDeep, find } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
  SelectOptionType,
} from "../../../../Utils/Types";
import DropTarget from "../DropTarget";
import LayoutItemComponent from "./index";

const ComponentPreviewListDetailLayout: React.FC<{
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
  const [settingsAnchor, setSettingsAnchor] =
    useState<HTMLButtonElement | null>();

  // Lifecycle
  useEffect(() => {
    setVariableList(context.utils.listifyObjectForSelect(variables, "label"));
  }, [context.utils, variables]);

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
        <div style={{ margin: 10 }}>
          <context.UI.Inputs.Text
            label="Title"
            value={layoutItem.args?.title}
            onChange={async (title) => {
              const newLayout = cloneDeep(layout);
              modifyRecursive(newLayout, layoutItem.key!, (item) => {
                const newItem = item;
                newItem!.args = {
                  ...(item!.args || {}),
                  title,
                };
                return newItem;
              });
              setLayout(newLayout);
            }}
          />
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
            <context.UI.Inputs.Select
              label="Label field"
              options={
                layoutItem.args?.listItems
                  ? context.utils.listifyObjectForSelect(
                      find(
                        modelList,
                        (o) =>
                          o.key === variables[layoutItem.args?.listItems].model
                      )?.fields || {},
                      "label"
                    )
                  : []
              }
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
          )}
        </div>
      </Popover>
      <context.UI.Design.Animation.Container>
        <Grid container>
          <Grid item xs={4}>
            <context.UI.Design.Animation.Item key="left">
              <context.UI.Design.Card
                withoutPadding
                title={layoutItem.args?.title}
                titleSecondary={
                  <Tooltip
                    placement="bottom"
                    title={
                      Boolean(settingsAnchor)
                        ? "Close layout settings"
                        : "Edit layout settings"
                    }
                  >
                    <IconButton
                      onClick={(e) => setSettingsAnchor(e.currentTarget)}
                    >
                      <context.UI.Design.Icon
                        icon={
                          Boolean(settingsAnchor) ? "times-circle" : "wrench"
                        }
                        size={18}
                      />
                    </IconButton>
                  </Tooltip>
                }
              >
                {layoutItem.args?.listItems && (
                  <List disablePadding>
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
              </context.UI.Design.Card>
            </context.UI.Design.Animation.Item>
          </Grid>
          <Grid item xs={8}>
            <context.UI.Design.Animation.Item key="right">
              <context.UI.Design.Card title="Detail">
                {layoutItem.args?.listItems && (
                  <DropTarget
                    id={layoutItem.key!}
                    layout={layout}
                    setLayout={setLayout}
                    dropHint={
                      layoutItem.items
                        ? "More detail page components"
                        : "Detail page components"
                    }
                  >
                    {(layoutItem.items || []).map(
                      (subLayoutItem, layoutItemIndex) => (
                        <LayoutItemComponent
                          layoutItem={subLayoutItem}
                          context={context}
                          key={`layoutItem-${layoutItemIndex}`}
                          layout={layout || []}
                          setLayout={setLayout}
                          modelList={modelList}
                          modelListOptions={modelListOptions}
                          variables={{
                            ...variables,
                            [`selected${layoutItem.args?.listItems}`]: {
                              label: `Selected ${
                                variables[layoutItem.args?.listItems].label
                              } item`,
                              type: "object",
                              model:
                                variables[layoutItem.args?.listItems].model,
                            },
                            [`selected${layoutItem.args?.listItems}Key`]: {
                              label: `Selected ${
                                variables[layoutItem.args?.listItems].label
                              } key`,
                              type: "text",
                            },
                          }}
                        />
                      )
                    )}
                  </DropTarget>
                )}
              </context.UI.Design.Card>
            </context.UI.Design.Animation.Item>
          </Grid>
        </Grid>
      </context.UI.Design.Animation.Container>
    </>
  );
};

export default ComponentPreviewListDetailLayout;
