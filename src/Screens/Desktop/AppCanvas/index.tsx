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
  ListSubheader,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { List } from "@material-ui/core";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { useGlobal } from "reactn";
import Icon from "../../../Components/Design/Icon";
import { AppContext } from "../../../Components/Context";
import { groupBy, map } from "lodash";
import { AppUtilsType } from "../../../App";
import { useSnackbar, VariantType } from "notistack";

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

const AppLayout: React.FC<{
  appKey: string;
  utils: AppUtilsType;
  setPageName: (title: string) => void;
  pageName: string;
  setUpLink: (title?: string) => void;
  upLink?: string;
  setHeaderIsIndented?: (isIndented: boolean) => void;
}> = ({
  appKey,
  utils,
  setPageName,
  pageName,
  setUpLink,
  upLink,
  setHeaderIsIndented,
}) => {
  // Vars
  const [app, setApp] = useState<AppObjectType>();
  const [colors] = useGlobal<any>("colors");
  const [pageMenu, setPageMenu] = useState<{}>();
  const [flatPageMenu, setFlatPageMenu] = useState<AppPageType[]>();
  const history = useHistory();
  const [context, setContext] = useState<AppContext>();
  const [selectedPage, setSelectedPage] = useState<string>();
  const { enqueueSnackbar } = useSnackbar();

  // Lifecycle
  useEffect(() => {
    const onReceive = (object: AppObjectType) => {
      setApp(object);
      setPageName(object.name);
      utils.setPrimaryColor(
        `rgb(${object?.color?.r},${object?.color?.g},${object?.color?.b})`
      );
      const context = new AppContext(object, {
        name: {
          get: pageName,
          set: (pageName?: string) => setPageName(pageName || object.name),
        },
        up: { set: setUpLink, get: upLink },
        interact: {
          snackbar: (msg: string, variant?: VariantType) =>
            enqueueSnackbar(msg, { variant }),
        },
      });
      setContext(context);

      const AppCode =
        require(`../../../AppDev/${object.key}/index.tsx`).default;
      const appCode = new AppCode();

      // Get app pages (and sort them in groups)
      appCode.getPages(context).then((result: AppPageType[]) => {
        setPageMenu(groupBy(result, (o) => o.group));
        setFlatPageMenu(result);
      });
    };

    Socket.emit(
      "systemGetsObject",
      "apps",
      { key: appKey },
      (response: ResponseType) => {
        onReceive(response.object);
        Socket.on(`receive ${response.key}`, onReceive);
      }
    );

    return () => {
      utils.setPrimaryColor();
    };
  }, [appKey]);
  useEffect(() => {
    if (setHeaderIsIndented)
      flatPageMenu
        ? setHeaderIsIndented(flatPageMenu.length > 0)
        : setHeaderIsIndented(false);

    return () => {
      setPageName("FrontBase");
      if (setHeaderIsIndented) setHeaderIsIndented(false);
    };
  }, [flatPageMenu]);

  // UI
  if (!app || !pageMenu) return <Loading />;
  return (
    <div className={styles.root}>
      {Object.keys(pageMenu).length > 0 && (
        <motion.div
          className={styles.menu}
          variants={container}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, left: -200 }}
          key="PageMenu"
        >
          <motion.div variants={item}>
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
          </motion.div>
          <List>
            {map(pageMenu, (pages: AppPageType[], groupKey: string) => (
              <>
                <motion.li key={`group-${groupKey}`} variants={item}>
                  <ListSubheader>{groupKey}</ListSubheader>
                </motion.li>
                {pages.map((page: AppPageType) => {
                  return (
                    <motion.li key={page.key} variants={item}>
                      <ListItem
                        button
                        onClick={() => history.push(`/${app.key}/${page.key}`)}
                        selected={page.key === selectedPage}
                      >
                        <ListItemIcon style={{ minWidth: 40 }}>
                          <Icon
                            icon={page.icon}
                            className={styles.pageMenuIcon}
                            primary={page.key === selectedPage}
                          />
                        </ListItemIcon>
                        <ListItemText className={styles.pageMenuText}>
                          {page.label}
                        </ListItemText>
                      </ListItem>
                    </motion.li>
                  );
                })}
              </>
            ))}
          </List>
        </motion.div>
      )}
      <div className={styles.appCanvas}>
        <Switch>
          {map(flatPageMenu, (page: AppPageType) => (
            <Route
              path={`/${appKey}/${page.key}`}
              render={(args) => {
                setSelectedPage(page.key);
                const Component = page.component;
                return context ? (
                  <Component context={context} page={page} />
                ) : (
                  <Loading />
                );
              }}
            />
          ))}
        </Switch>
      </div>
    </div>
  );
};

export default AppLayout;
