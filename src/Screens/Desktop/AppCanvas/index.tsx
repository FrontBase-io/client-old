import React, { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../Components/Loading";
import Socket from "../../../Utils/Socket";
import {
  AppObjectType,
  AppPageType,
  DialogType,
  ResponseType,
} from "../../../Utils/Types";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import {
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextInput from "../../../Components/Inputs/Text";

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
  const [dialog, setDialog] = useState<DialogType>({});
  const [dialogFieldValues, setDialogFieldValues] = useState<{
    [key: string]: any;
  }>({});

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
          dialog: setDialog,
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
    <>
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
                          onClick={() =>
                            history.push(`/${app.key}/${page.key}`)
                          }
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
      <Dialog
        open={dialog.display || false}
        onClose={() => setDialog({ ...dialog, display: false })}
        maxWidth={dialog.size || "md"}
        fullWidth={true}
      >
        {dialog.title && (
          <DialogTitle id="dialog-title">{dialog.title}</DialogTitle>
        )}
        <DialogContent>
          {dialog.text && (
            <DialogContentText id="dialog-content">
              {dialog.text}
            </DialogContentText>
          )}
          {dialog.fields && (
            <Grid container>
              {map(dialog.fields, (field, key) => (
                <Grid item key={key} xs={field.width || 12}>
                  {(!field.type ||
                    field.type === "text" ||
                    field.type === "key") && (
                    <TextInput
                      label={field.label}
                      value={dialogFieldValues[key]}
                      keyMode={field.type === "key"}
                      onChange={(value) =>
                        setDialogFieldValues({
                          ...dialogFieldValues,
                          [key]: value,
                        })
                      }
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        {dialog.actions && (
          <DialogActions>
            {dialog.actions.map((action) => (
              <Button
                onClick={() => {
                  action.onClick &&
                    action.onClick(dialogFieldValues, () =>
                      setDialog({ ...dialog, display: false })
                    );
                  setDialogFieldValues({});
                }}
                color="primary"
              >
                {action.label}
              </Button>
            ))}
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default AppLayout;
