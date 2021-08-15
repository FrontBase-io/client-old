import React, { useEffect, useState } from "react";
import Socket from "../../Utils/Socket";
import { AppObjectType, ResponseType } from "../../Utils/Types";
import Loading from "../../Components/Loading";
import NavBar from "./LayoutComponents/NavBar";
import Popover from "@material-ui/core/Popover";
import AppMenu from "./LayoutComponents/AppMenu";
import AppCanvas from "./LayoutComponents/AppCanvas";

const Desktop: React.FC = () => {
  // Vars
  const [apps, setApps] = useState<AppObjectType[]>([]);
  const [appMenuElement, setAppMenuElement] = useState<Element | null>();
  const [userMenuElement, setUserMenuElement] = useState<Element | null>();

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
        />
        <div style={{ flex: 1 }}>
          <AppCanvas />
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
