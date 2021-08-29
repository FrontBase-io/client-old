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
}> = ({ context, title, items, baseUrl, detailComponent }) => {
  // Vars
  const history = useHistory();
  const [selectedItem, setSelectedItem] = useState<string>();

  // Lifecycle
  // UI
  return (
    <context.UI.Design.Animation.AnimateContainer>
      <Grid container>
        <Grid item xs={2}>
          <context.UI.Design.Animation.AnimateItem key="menu">
            <context.UI.Design.Card title={title} withoutPadding>
              <List disablePadding>
                {items.map((menuItem) => (
                  <ListItem
                    key={menuItem.key}
                    button
                    onClick={() => history.push(`${baseUrl}/${menuItem.key}`)}
                    selected={menuItem.key === selectedItem}
                    style={{ paddingLeft: 0 }}
                  >
                    {menuItem.icon && (
                      <ListItemIcon style={{ minWidth: 48 }}>
                        <Icon icon={menuItem.icon} size={18} />
                      </ListItemIcon>
                    )}
                    <ListItemText>{menuItem.label}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </context.UI.Design.Card>
          </context.UI.Design.Animation.AnimateItem>
        </Grid>
        <Grid item xs={10}>
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
                />
              )}
            />
          </Switch>
        </Grid>
      </Grid>
    </context.UI.Design.Animation.AnimateContainer>
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
}> = ({
  context,
  component,
  selectedKey,
  baseUrl,
  title,
  items,
  setSelectedItem,
}) => {
  // Vars
  // Lifecycle
  useEffect(() => {
    // Up
    context.canvas.up.set(baseUrl);
    context.canvas.name.set(item.label);
    setSelectedItem(item.key);
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
  return <Component context={context} selectedKey={selectedKey} item={item} />;
};

export default ListDetailLayout;
