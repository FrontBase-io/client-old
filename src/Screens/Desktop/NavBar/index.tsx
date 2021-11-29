import React, { useState } from "react";
import styles from "./styles.module.scss";
import logo from "./logo.png";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import { useHistory } from "react-router";
import { useGlobal } from "reactn";
import { AppObjectType } from "../../../Utils/Types";
import NavBarAppIcon from "../AppIcon/AppIconNavBar";
import { useEffect } from "react";
import Socket from "../../../Utils/Socket";
import { ResponseType } from "../../../Utils/Types";
import find from "lodash/find";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
} from "@mui/material";
import Card from "../../../Components/Design/Card";
import Icon from "../../../Components/Design/Icon";
import Server from "../../../Utils/Socket";
import { filter } from "lodash";

const NavBar: React.FC<{
  onOpenAppMenu: (event: React.MouseEvent) => void;
  onOpenUserMenu: (event: React.MouseEvent) => void;
  selectedApp?: AppObjectType;
  apps: AppObjectType[];
}> = ({ onOpenAppMenu, onOpenUserMenu, selectedApp, apps }) => {
  // Vars
  const history = useHistory();
  const [colors] = useGlobal<any>("colors");
  const [favoriteList, setFavoriteList] = useState<string[]>([]);
  const [menuElement, setMenuElement] = useState<HTMLDivElement | undefined>();
  const [selectedMenuApp, setSelectedMenuApp] = useState<AppObjectType>();

  //Lifecycle
  useEffect(() => {
    Socket.emit("getUserSetting", "favoriteApps", (response: ResponseType) =>
      setFavoriteList(response.value)
    );
  }, []);
  // UI
  return (
    <div
      className={styles.navbar}
      style={{ backgroundColor: colors.primary.hex() }}
    >
      <Popover
        id="app-menu"
        open={Boolean(menuElement)}
        anchorEl={menuElement}
        onClose={() => setMenuElement(undefined)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        elevation={0}
        PaperProps={{ style: { backgroundColor: "transparent" } }}
      >
        <Card title={selectedMenuApp?.name} withoutPadding>
          <List>
            {favoriteList?.includes(selectedMenuApp?.key || "") ? (
              <ListItem
                button
                onClick={() => {
                  Server.emit(
                    "setUserSetting",
                    "favoriteApps",
                    filter(favoriteList, (o) => o !== selectedMenuApp!.key),
                    () => {
                      console.log(
                        filter(favoriteList, (o) => o !== selectedMenuApp!.key)
                      );

                      setFavoriteList(
                        filter(favoriteList, (o) => o !== selectedMenuApp!.key)
                      );
                      setMenuElement(undefined);
                    }
                  );
                }}
              >
                <ListItemIcon style={{ minWidth: 24 }}>
                  <Icon icon="map-pin" />
                </ListItemIcon>
                <ListItemText>Unpin</ListItemText>
              </ListItem>
            ) : (
              <ListItem
                button
                onClick={() => {
                  Server.emit(
                    "setUserSetting",
                    "favoriteApps",
                    [...(favoriteList || []), selectedMenuApp!.key],
                    () => {
                      setFavoriteList([
                        ...(favoriteList || []),
                        selectedMenuApp!.key,
                      ]);
                      setMenuElement(undefined);
                    }
                  );
                }}
              >
                <ListItemIcon style={{ minWidth: 24 }}>
                  <Icon icon="map-pin" />
                </ListItemIcon>
                <ListItemText>Pin to bar</ListItemText>
              </ListItem>
            )}
            <ListSubheader>PIN</ListSubheader>
            <ListItem button>
              <ListItemText>Test</ListItemText>
            </ListItem>
            <ListSubheader>PIN</ListSubheader>
            <ListItem button>
              <ListItemText>Test</ListItemText>
            </ListItem>
          </List>
        </Card>
      </Popover>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          overflowX: "visible",
        }}
      >
        <div
          style={{ height: 40, marginBottom: 10 }}
          onClick={(event) => {
            window.location.pathname === "/" || window.location.pathname === ""
              ? onOpenAppMenu(event)
              : history.push("/");
          }}
          onContextMenu={(event) => {
            window.location.pathname === "/" || window.location.pathname === ""
              ? onOpenAppMenu(event)
              : onOpenAppMenu(event);
            event.preventDefault();
          }}
        >
          <Tooltip
            title={
              window.location.pathname === "/" ||
              window.location.pathname === ""
                ? "View apps"
                : "Go home"
            }
            placement="right"
          >
            <img
              alt="Frontbase Logo"
              src={logo}
              className={styles.logo}
              style={{ width: 44 }}
            />
          </Tooltip>
        </div>
        <div
          style={{
            flex: 1,
            padding: "10px 0",
            width: "100%",
            overflowX: "visible",
          }}
        >
          {selectedApp && !favoriteList?.includes(selectedApp.key) && (
            <NavBarAppIcon
              app={selectedApp}
              selected
              onRightClick={(e, app) => {
                setMenuElement(e.currentTarget);
                e.stopPropagation();
                e.preventDefault();
                setSelectedMenuApp(app);
                return false;
              }}
            />
          )}
          {favoriteList?.map((appKey) => (
            <NavBarAppIcon
              app={find(apps, (o) => o.key === appKey) as AppObjectType}
              selected={selectedApp?.key === appKey}
              onRightClick={(e, app) => {
                setMenuElement(e.currentTarget);
                e.stopPropagation();
                e.preventDefault();
                setSelectedMenuApp(app);
                return false;
              }}
            />
          ))}
        </div>
        <div style={{ height: 40, marginBottom: 10, verticalAlign: "middle" }}>
          <Tooltip
            title={`Hi, Vic!`}
            placement="right"
            onClick={(event) => onOpenUserMenu(event)}
          >
            <Avatar color="primary" style={{ cursor: "pointer" }}>
              Vic
            </Avatar>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
