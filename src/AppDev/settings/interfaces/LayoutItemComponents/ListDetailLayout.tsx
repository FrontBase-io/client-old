import { Grid, List, ListItem, ListItemText } from "@mui/material";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
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
}> = ({ context, layoutItem, layout, setLayout, variables }) => {
  // Vars
  const [variableList, setVariableList] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    setVariableList(context.utils.listifyObjectForSelect(variables, "label"));
  }, [variables]);

  // UI
  return (
    <context.UI.Design.Animation.Container>
      <Grid container>
        <Grid item xs={4}>
          <context.UI.Design.Animation.Item key="left">
            <context.UI.Design.Card title={layoutItem.args?.title}>
              {layoutItem.args?.listItems && (
                <List disablePadding>
                  <ListItem button>
                    <ListItemText>
                      {layoutItem.args?.listItems} item #1
                    </ListItemText>
                  </ListItem>
                  <ListItem button>
                    <ListItemText>
                      {layoutItem.args?.listItems} item #2
                    </ListItemText>
                  </ListItem>
                  <ListItem button>
                    <ListItemText>
                      {layoutItem.args?.listItems} item #3
                    </ListItemText>
                  </ListItem>
                </List>
              )}
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
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={8}>
          <context.UI.Design.Animation.Item key="right">
            <context.UI.Design.Card title="Right">
              {layoutItem.args?.listItems && (
                <DropTarget
                  id={layoutItem.key!}
                  layout={layout}
                  setLayout={setLayout}
                >
                  {(layoutItem.items || []).map(
                    (subLayoutItem, layoutItemIndex) => (
                      <LayoutItemComponent
                        layoutItem={subLayoutItem}
                        context={context}
                        key={`layoutItem-${layoutItemIndex}`}
                        layout={layout || []}
                        setLayout={setLayout}
                        variables={{
                          ...variables,
                          [`selected${layoutItem.args?.listItems}`]: {
                            label: `Selected ${
                              variables[layoutItem.args?.listItems].label
                            } item`,
                            type: "object",
                            model: variables[layoutItem.args?.listItems].model,
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
  );
};

export default ComponentPreviewListDetailLayout;
