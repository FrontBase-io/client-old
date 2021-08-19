import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { Switch, useHistory, Route } from "react-router-dom";
import { AppContext } from "../../..";
import { ListItemType } from "../../../../../Utils/Types";
import Icon from "../../../../Design/Icon";

const ListDetailLayout: React.FC<{
  context: AppContext;
  title?: string;
  menu: ListItemType[];
  baseUrl: string;
  detailComponent: React.FC<{ context: AppContext; selectedKey: string }>;
}> = ({ context, title, menu, baseUrl, detailComponent }) => {
  // Vars
  const history = useHistory();

  // Lifecycle
  // UI
  return (
    <context.UI.Design.Animation.AnimateContainer>
      <Grid container>
        <Grid item xs={2}>
          <context.UI.Design.Animation.AnimateItem key="menu">
            <context.UI.Design.Card title={title}>
              <List>
                {menu.map((menuItem) => (
                  <ListItem
                    key={menuItem.key}
                    button
                    onClick={() => history.push(`${baseUrl}/${menuItem.key}`)}
                  >
                    {menuItem.icon && (
                      <ListItemIcon>
                        <Icon icon={menuItem.icon} />
                      </ListItemIcon>
                    )}
                    <ListItemText>{menuItem.label}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </context.UI.Design.Card>
          </context.UI.Design.Animation.AnimateItem>
        </Grid>
        <Grid item xs={8}>
          <Switch>
            <Route
              path={`${baseUrl}/:selectedItem`}
              render={(args) => (
                <DetailComponentWrapper
                  context={context}
                  component={detailComponent}
                  selectedKey={args.match.params.selectedItem}
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
  component: React.FC<{ context: AppContext; selectedKey: string }>;
  selectedKey: string;
}> = ({ context, component, selectedKey }) => {
  const Component = component;
  return <Component context={context} selectedKey={selectedKey} />;
};

export default ListDetailLayout;
