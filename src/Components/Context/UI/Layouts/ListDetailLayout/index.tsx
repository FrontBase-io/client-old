import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import find from "lodash/find";
import React, { useEffect, useState } from "react";
import { Switch, useHistory, Route } from "react-router-dom";
import { useGlobal } from "reactn";
import { AppContext } from "../../..";
import { ListItemType } from "../../../../../Utils/Types";
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
  withoutPadding?: true;
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
  withoutPadding,
}) => {
  // Vars
  const history = useHistory();
  let selectedItem = window.location.href.split(`${baseUrl}/`)[1];
  if ((selectedItem || "").match("/"))
    selectedItem = selectedItem.split("/")[0];
  const [isMobile] = useGlobal<any>("isMobile");

  // Lifecycle

  // UI
  return (
    <context.UI.Design.Animation.Container>
      <Grid container style={{ height: "100%" }}>
        {((isMobile && !selectedItem) || !isMobile) && (
          <Grid item xs={12} md={navWidth || 2} style={{ height: "100%" }}>
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
                          style={{ paddingLeft: withoutPadding && 0 }}
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
                          <ListItemText
                            primary={menuItem.label}
                            secondary={menuItem.secondary}
                          />
                        </ListItem>
                      </context.UI.Design.Animation.Item>
                    ))}
                    {create && (
                      <>
                        <Divider />
                        <context.UI.Design.Animation.Item key="create">
                          <ListItem button onClick={create.onClick}>
                            <ListItemText>
                              {create.label || "Create"}
                            </ListItemText>
                          </ListItem>
                        </context.UI.Design.Animation.Item>
                      </>
                    )}
                  </context.UI.Design.Animation.Container>
                </List>
              </context.UI.Design.Card>
            </context.UI.Design.Animation.Item>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          //@ts-ignore
          md={navWidth ? 12 - navWidth : 10}
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
  detailComponentProps?: { [key: string]: any };
}> = ({
  context,
  component,
  selectedKey,
  baseUrl,
  items,
  detailComponentProps,
}) => {
  // Vars
  // Lifecycle
  const item = find(items, (o) => o.key === selectedKey) as ListItemType;

  useEffect(() => {
    // Up
    context.canvas.navbar.up(baseUrl);
    if (item) context.canvas.navbar.name(item.label);
    return () => {
      context.canvas.navbar.up(undefined);
      context.canvas.navbar.name();
    };
  }, [selectedKey, context.canvas.navbar, baseUrl, item]);

  // UI
  const Component = component;
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
