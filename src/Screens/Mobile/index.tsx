import {
  Tooltip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Collapse,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { find } from "lodash";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { useGlobal } from "reactn";
import { AppUtilsType } from "../../App";
import O from "../../AppDev/system/o";
import Icon from "../../Components/Design/Icon";
import Socket from "../../Utils/Socket";
import { AppObjectType, NavBarButtonType } from "../../Utils/Types";
import HomeScreen from "../Home";
import AppCanvas from "./AppCanvas";
import frontbase from "./frontbase.png";
import styles from "./styles.module.scss";
const Mobile: React.FC<{ utils: AppUtilsType }> = ({ utils }) => {
  // Vars
  const [apps, setApps] = useState<AppObjectType[]>();
  const [appMenuElement, setAppMenuElement] = useState<Element | null>();
  const [userMenuElement, setUserMenuElement] = useState<Element | null>();
  const [selectedApp, setSelectedApp] = useState<AppObjectType>();
  const history = useHistory();
  const [upLink, setUpLink] = useState<(() => void) | string | undefined>();
  const [pageName, setPageName] = useState<string>("FrontBase");
  const [headerIsIndented, setHeaderIsIndented] = useState<Boolean>(false);
  const [navBarActions, setNavBarActions] = useState<{
    [key: string]: NavBarButtonType;
  }>({});
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [theme] = useGlobal<any>("theme");
  const [favoriteList, setFavoriteList] = useState<string[]>([]);
  const [showAllApps, setShowAllApps] = useState<boolean>(false);

  // Lifecycle
  useEffect(() => {
    Socket.emit("getUserSetting", "favoriteApps", (response: ResponseType) =>
      //@ts-ignore
      setFavoriteList(response.value)
    );

    const onReceive = (objects: AppObjectType[]) => {
      setApps(objects);
    };
    Socket.emit("getObjects", "apps", {}, (response: ResponseType) => {
      //@ts-ignore
      onReceive(response.objects);
      //@ts-ignore
      Socket.on(`receive ${response.key}`, onReceive);
    });
  }, []);

  // UI
  return (
    <>
      <Drawer
        anchor="left"
        open={menuIsOpen}
        onClose={() => setMenuIsOpen(false)}
        style={{ display: "flex" }}
        PaperProps={{ style: { minWidth: "60vw" } }}
      >
        <List disablePadding style={{ flex: 1 }}>
          <ListItem
            style={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              height: 64,
            }}
            button
            onClick={() => {
              history.push("/");
              setMenuIsOpen(false);
            }}
          >
            <ListItemIcon style={{ minWidth: 24 }}>
              <img
                style={{ width: 32, height: 32 }}
                src={frontbase}
                alt="Frontbase logo"
              />
            </ListItemIcon>
            <ListItemText style={{ textAlign: "center" }}>
              <Typography variant="h6" style={{ fontSize: 18 }}>
                FrontBase
              </Typography>
            </ListItemText>
          </ListItem>
          <Divider />
          {favoriteList.map((fave) => {
            const app = find(apps, (o) => o.key === fave) as AppObjectType;
            return app ? (
              <ListItem
                key={fave}
                button
                disablePadding
                style={{ padding: "5px 10px" }}
                onClick={() => {
                  history.push(`/${app.key}`);
                  setMenuIsOpen(false);
                }}
              >
                <ListItemIcon
                  style={{
                    minWidth: 18,
                    marginRight: 15,
                    color: `rgb(${app.color.r}, ${app.color.g}, ${app.color.b})`,
                  }}
                >
                  <Icon icon={app.icon} />
                </ListItemIcon>
                <ListItemText>{app.name}</ListItemText>
              </ListItem>
            ) : (
              <ListItem>error</ListItem>
            );
          })}
          <ListItem button onClick={() => setShowAllApps(!showAllApps)}>
            <ListItemText primary="Show all" style={{ marginLeft: 35 }} />
            {showAllApps ? (
              <Icon icon="angle-up" />
            ) : (
              <Icon icon="angle-down" />
            )}
          </ListItem>
          <Collapse in={showAllApps} timeout="auto" unmountOnExit>
            <List disablePadding>
              {apps?.map(
                (app) =>
                  !favoriteList.includes(app.key) && (
                    <ListItem
                      button
                      onClick={() => {
                        history.push(`/${app.key}`);
                        setMenuIsOpen(false);
                      }}
                      key={app.key}
                    >
                      <ListItemIcon
                        style={{
                          color: `rgb(${app.color.r}, ${app.color.g}, ${app.color.b})`,
                        }}
                      >
                        <Icon icon={app.icon} />
                      </ListItemIcon>
                      <ListItemText primary={app.name} />
                    </ListItem>
                  )
              )}
            </List>
          </Collapse>
        </List>
        <Divider />
        <List disablePadding>
          <ListItem button>
            <ListItemIcon>
              <Avatar color="primary" style={{ cursor: "pointer" }}>
                Vic
              </Avatar>
            </ListItemIcon>
            <ListItemText>Vic</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <AppBar
        position="static"
        style={{
          height: "30vh",
          zIndex: 10,
          color: "white",
        }}
      >
        <Toolbar style={{ width: "calc(100% - 280px)" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setMenuIsOpen(true)}
          >
            <Tooltip title="Apps" placement="bottom">
              <img
                src={frontbase}
                style={{ width: 28, height: 28 }}
                alt="Open apps"
              />
            </Tooltip>
          </IconButton>
          <Typography variant="h6" style={{ flex: 1 }}>
            {pageName}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.appCanvas}>
        <Switch>
          <Route
            path="/o/:objectId"
            render={(args) => <O id={args.match.params.objectId} />}
          />

          <Route
            path="/:appKey"
            render={(args) => {
              setSelectedApp(
                find(apps, (o) => o.key === args.match.params.appKey)
              );
              return (
                <AppCanvas
                  appKey={args.match.params.appKey}
                  utils={utils}
                  setUpLink={setUpLink}
                  upLink={upLink}
                  pageName={pageName}
                  setPageName={setPageName}
                  addNavbarAction={(key, action) =>
                    setNavBarActions({ ...navBarActions, [key]: action })
                  }
                  removeNavbarAction={(key) => {
                    const newNavBarActions = navBarActions;
                    delete newNavBarActions[key];
                    setNavBarActions({ ...newNavBarActions });
                  }}
                />
              );
            }}
          />
          <Route
            path="/"
            render={() => {
              setSelectedApp(undefined);
              return <HomeScreen />;
            }}
          />
        </Switch>
      </div>
    </>
  );
};

export default Mobile;
