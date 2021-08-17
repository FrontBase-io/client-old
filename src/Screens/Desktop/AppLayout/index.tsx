import React, { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../Components/Loading";
import Socket from "../../../Utils/Socket";
import {
  AppObjectType,
  AppPageType,
  PageType,
  ResponseType,
} from "../../../Utils/Types";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { ListItem, Typography } from "@material-ui/core";
import { List } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useGlobal } from "reactn";

const container = {
  hidden: { opacity: 0, left: -50 },
  visible: {
    opacity: 1,
    left: 64,

    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
      duration: 0.2,
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

  // Lifecycle
  useEffect(() => {
    const onReceive = (object: AppObjectType) => {
      setApp(object);
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
        >
          <motion.li variants={item}>
            <Link to={`/${app.key}`}>
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
            {pageMenu.map((page: PageType) => (
              <motion.li key={page.key} variants={item}>
                <ListItem
                  button
                  onClick={() => history.push(`/${app.key}/${page.key}`)}
                >
                  {page.label}
                </ListItem>
              </motion.li>
            ))}
          </List>
        </motion.div>
      )}
      <div className={styles.appCanvas}>{app.name}</div>
    </div>
  );
};

export default AppLayout;
