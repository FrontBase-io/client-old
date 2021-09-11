import React, { useEffect, useState } from "react";
import Socket from "../../Utils/Socket";
import { AppObjectType, ResponseType } from "../../Utils/Types";
import Loading from "../../Components/Loading";
import NavBar from "./NavBar";
import Popover from "@material-ui/core/Popover";
import AppMenu from "./AppMenu";
import AppCanvas from "./AppCanvas";
import { Route, Switch, useHistory } from "react-router-dom";
import HomeScreen from "../Home";
import find from "lodash/find";
import { AppUtilsType } from "../../App";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "../../Components/Design/Icon";
import Typography from "@material-ui/core/Typography";
import styles from "./styles.module.scss";

const Desktop: React.FC<{ utils: AppUtilsType }> = ({ utils }) => {
  // Vars
  const [apps, setApps] = useState<AppObjectType[]>();
  const [appMenuElement, setAppMenuElement] = useState<Element | null>();
  const [userMenuElement, setUserMenuElement] = useState<Element | null>();
  const [selectedApp, setSelectedApp] = useState<AppObjectType>();
  const history = useHistory();
  const [upLink, setUpLink] = useState<string | undefined>();
  const [pageName, setPageName] = useState<string>("FrontBase");
  const [headerIsIndented, setHeaderIsIndented] = useState<Boolean>(false);

  // Lifecycle
  useEffect(() => {
    const onReceive = (objects: AppObjectType[]) => {
      setApps(objects);
    };
    Socket.emit("getObjects", "apps", {}, (response: ResponseType) => {
      onReceive(response.objects);
      Socket.on(`receive ${response.key}`, onReceive);
    });
  }, []);

  // UI
  if (!apps) return <Loading />;
  return (
    <>
      <div style={{ display: "flex" }}>
        <NavBar
          onOpenAppMenu={(event: React.MouseEvent<Element>) => {
            setAppMenuElement(event.currentTarget);
          }}
          onOpenUserMenu={(event: React.MouseEvent<Element>) => {
            setUserMenuElement(event.currentTarget);
          }}
          selectedApp={selectedApp}
          apps={apps}
        />
        <div style={{ flex: 1, zIndex: 1 }}>
          <AppBar
            position="static"
            style={{
              height: "30vh",
              zIndex: 10,
              color: "white",
              marginLeft: headerIsIndented ? 240 : 0,
            }}
          >
            <Toolbar>
              {upLink !== undefined && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => history.push(upLink)}
                >
                  <Icon icon="chevron-left" />
                </IconButton>
              )}
              <Typography variant="h6" noWrap>
                {pageName}
              </Typography>
              <div style={{ flex: 1 }} />
            </Toolbar>
          </AppBar>
          <div className={styles.canvasContent}>
            <Switch>
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
                      setHeaderIsIndented={setHeaderIsIndented}
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
        </div>
      </div>
      <Popover
        id="app-menu"
        open={Boolean(appMenuElement)}
        anchorEl={appMenuElement}
        onClose={() => setAppMenuElement(undefined)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{ elevation: 0, style: { backgroundColor: "transparent" } }}
      >
        <AppMenu apps={apps} closeMenu={() => setAppMenuElement(undefined)} />
      </Popover>
      <Popover
        id="user-menu"
        open={Boolean(userMenuElement)}
        anchorEl={userMenuElement}
        onClose={() => setUserMenuElement(undefined)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        User menu
      </Popover>
    </>
  );
};

export default Desktop;
