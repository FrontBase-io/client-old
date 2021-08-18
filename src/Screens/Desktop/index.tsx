import React, { useEffect, useState } from "react";
import Socket from "../../Utils/Socket";
import { AppObjectType, ResponseType } from "../../Utils/Types";
import Loading from "../../Components/Loading";
import NavBar from "./NavBar";
import Popover from "@material-ui/core/Popover";
import AppMenu from "./AppMenu";
import AppCanvas from "./AppCanvas";
import { Route, Switch } from "react-router-dom";
import HomeScreen from "../Home";
import find from "lodash/find";

const Desktop: React.FC = () => {
  // Vars
  const [apps, setApps] = useState<AppObjectType[]>([]);
  const [appMenuElement, setAppMenuElement] = useState<Element | null>();
  const [userMenuElement, setUserMenuElement] = useState<Element | null>();
  const [selectedApp, setSelectedApp] = useState<AppObjectType>();

  // Lifecycle
  useEffect(() => {
    const onReceive = (objects: AppObjectType[]) => {
      setApps(objects);
    };
    Socket.emit("systemGetsObjects", "apps", {}, (response: ResponseType) => {
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
        />
        <div style={{ flex: 1 }}>
          <Switch>
            <Route
              path="/:appKey"
              render={(args) => {
                setSelectedApp(
                  find(apps, (o) => o.key === args.match.params.appKey)
                );
                return <AppCanvas appKey={args.match.params.appKey} />;
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
