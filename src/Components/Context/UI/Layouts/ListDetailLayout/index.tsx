import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import find from "lodash/find";
import React, { useEffect, useState } from "react";
import { Switch, useHistory, Route } from "react-router-dom";
import { AppContext } from "../../..";
import { ListItemType, ObjectType } from "../../../../../Utils/Types";
import Icon from "../../../../Design/Icon";

const ListDetailLayout: React.FC<{
  context: AppContext;
  title?: string;
  items: ListItemType[];
  baseUrl: string;
  detailComponent: React.FC<{
    context: AppContext;
    selectedKey: string;
    item: ListItemType;
  }>;
  create?: { onClick?: () => void; label?: string };
  transformIcon?: (val: string) => string;
  detailComponentProps?: { [key: string]: any };
  navWidth?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}> = ({
  context,
  title,
  items,
  baseUrl,
  detailComponent,
  create,
  transformIcon,
  detailComponentProps,
  navWidth,
}) => {
  // Vars
  const history = useHistory();
  const [selectedItem, setSelectedItem] = useState<string>();

  // Lifecycle

  // UI
  return (
    <context.UI.Design.Animation.Container>
      <Grid container>
        <Grid item xs={navWidth || 2}>
          <context.UI.Design.Animation.Item key="menu">
            <context.UI.Design.Card title={title} withoutPadding>
              <List disablePadding>
                <context.UI.Design.Animation.Container>
                  {(items || []).map((menuItem) => (
                    <context.UI.Design.Animation.Item key={menuItem.key}>
                      <ListItem
                        button
                        onClick={() =>
                          history.push(`${baseUrl}/${menuItem.key}`)
                        }
                        selected={menuItem.key === selectedItem}
                        style={{ paddingLeft: 0 }}
                      >
                        {menuItem.icon && (
                          <ListItemIcon style={{ minWidth: 48 }}>
                            <Icon
                              icon={
                                transformIcon
                                  ? transformIcon(menuItem.icon)
                                  : menuItem.icon
                              }
                              size={18}
                            />
                          </ListItemIcon>
                        )}
                        <ListItemText>{menuItem.label}</ListItemText>
                      </ListItem>
                    </context.UI.Design.Animation.Item>
                  ))}
                  {create && (
                    <context.UI.Design.Animation.Item key="create">
                      <ListItem button onClick={create.onClick}>
                        <ListItemText>{create.label || "Create"}</ListItemText>
                      </ListItem>
                    </context.UI.Design.Animation.Item>
                  )}
                </context.UI.Design.Animation.Container>
              </List>
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid
          item
          //@ts-ignore
          xs={navWidth ? 12 - navWidth : 10}
        >
          <Switch>
            <Route
              path={`${baseUrl}/:selectedItem`}
              render={(args) => (
                <DetailComponentWrapper
                  context={context}
                  component={detailComponent}
                  selectedKey={args.match.params.selectedItem}
                  baseUrl={baseUrl}
                  title={title}
                  items={items}
                  setSelectedItem={setSelectedItem}
                  detailComponentProps={detailComponentProps}
                />
              )}
            />
          </Switch>
        </Grid>
      </Grid>
    </context.UI.Design.Animation.Container>
  );
};

const DetailComponentWrapper: React.FC<{
  context: AppContext;
  component: React.FC<{
    context: AppContext;
    selectedKey: string;
    item: ListItemType;
  }>;
  selectedKey: string;
  baseUrl: string;
  title?: string;
  items: ListItemType[];
  setSelectedItem: (key?: string) => void;
  detailComponentProps?: { [key: string]: any };
}> = ({
  context,
  component,
  selectedKey,
  baseUrl,
  title,
  items,
  setSelectedItem,
  detailComponentProps,
}) => {
  // Vars
  // Lifecycle
  useEffect(() => {
    // Up
    context.canvas.up.set(baseUrl);
    if (item) context.canvas.name.set(item.label);
    if (item) setSelectedItem(item.key);
    return () => {
      context.canvas.up.set(undefined);
      context.canvas.name.set();
      context.canvas.name.set(title);
      setSelectedItem();
    };
  }, [selectedKey]);
  // UI
  const Component = component;
  const item = find(items, (o) => o.key === selectedKey) as ListItemType;
  return (
    <Component
      context={context}
      selectedKey={selectedKey}
      item={item}
      {...detailComponentProps}
    />
  );
};

export default ListDetailLayout;
