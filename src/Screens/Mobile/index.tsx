import { IconButton, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { AppUtilsType } from "../../App";
import Icon from "../../Components/Design/Icon";
import { AppObjectType, NavBarButtonType } from "../../Utils/Types";

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
  // Lifecycle
  // UI
  return (
    <>
      <AppBar
        position="static"
        style={{
          height: "30vh",
          zIndex: 10,
          color: "white",
        }}
      >
        <Toolbar style={{ width: "calc(100% - 280px)" }}>
          <IconButton size="large" edge="start" color="inherit">
            <Icon icon="bars" size={18} />
          </IconButton>
          <Typography variant="h6" style={{ flex: 1 }}>
            {pageName}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Mobile;
