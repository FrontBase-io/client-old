import React, { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../Components/Loading";
import Socket from "../../../Utils/Socket";
import { AppObjectType, AppPageType, ResponseType } from "../../../Utils/Types";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import {
  AppBar,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { List } from "@material-ui/core";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { useGlobal } from "reactn";
import Icon from "../../../Components/Design/Icon";
import { AppContext } from "../../../Components/Context";

const container = {
  hidden: { opacity: 0, marginLeft: -64 },
  visible: {
    opacity: 1,
    marginLeft: 0,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
      duration: 0.1,
    },
  },
};

const item = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
  },
};

const AppLayout: React.FC<{ appKey: string }> = ({ appKey }) => {
  // Vars
  const [app, setApp] = useState<AppObjectType>();
  const [colors] = useGlobal<any>("colors");
  const [pageMenu, setPageMenu] = useState<AppPageType[]>();
  const history = useHistory();
  const [upLink, setUpLink] = useState<
    { title: string; url: string } | undefined
  >();
  const [context, setContext] = useState<AppContext>();
  const [pageName, setPageName] = useState<string>("FrontBase");

  // Lifecycle
  useEffect(() => {
    const onReceive = (object: AppObjectType) => {
      setApp(object);
      setPageName(object.name);
      setContext(
        new AppContext(object, {
          name: {
            get: pageName,
            set: (pageName?: string) => setPageName(pageName || object.name),
          },
          up: { set: setUpLink, get: upLink },
        })
      );
    };
    const AppCode = require(`../../../AppDev/settings/index.tsx`).default;
    const appCode = new AppCode();

    appCode.getPages().then((result: AppPageType[]) => setPageMenu(result));

    Socket.emit(
      "systemGetsObject",
      "apps",
      { key: appKey },
      (response: ResponseType) => {
        onReceive(response.object);
        Socket.on(`receive ${response.key}`, onReceive);
      }
    );
  }, []);

  // UI
  if (!app || !pageMenu) return <Loading />;
  return (
    <div className={styles.root}>
      {pageMenu.length > 0 && (
        <motion.div
          className={styles.menu}
          variants={container}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, left: -200 }}
          key="PageMenu"
        >
          <motion.li variants={item}>
            <Link
              to={`/${app.key}`}
              className="no-link"
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              <Typography
                variant="h6"
                className={styles.appName}
                style={{ color: `${colors.primary.hex}` }}
              >
                {app.name}
              </Typography>
            </Link>
          </motion.li>
          <List>
            {pageMenu.map((page: AppPageType) => (
              <motion.li key={page.key} variants={item}>
                <ListItem
                  button
                  onClick={() => history.push(`/${app.key}/${page.key}`)}
                >
                  <ListItemIcon style={{ minWidth: 40 }}>
                    <Icon icon={page.icon} className={styles.pageMenuIcon} />
                  </ListItemIcon>
                  <ListItemText className={styles.pageMenuText}>
                    {page.label}
                  </ListItemText>
                </ListItem>
              </motion.li>
            ))}
          </List>
        </motion.div>
      )}
      <div className={styles.appCanvas}>
        <AppBar position="static" style={{ height: "30vh", zIndex: 10 }}>
          <Toolbar>
            {upLink !== undefined && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => history.push(upLink.url)}
              >
                <Icon icon="chevron_left" />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              {pageName}
            </Typography>
            <div style={{ flex: 1 }} />
            <IconButton aria-label="show more" color="inherit">
              <Icon icon="more" />
            </IconButton>
          </Toolbar>
        </AppBar>

        <div className={styles.appContent}>
          <Switch>
            {pageMenu.map((page: AppPageType) => (
              <Route
                path={`/${appKey}/${page.key}`}
                render={(args) => {
                  const Component = page.component;
                  return context ? (
                    <Component context={context} />
                  ) : (
                    <Loading />
                  );
                }}
              />
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
