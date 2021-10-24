import React, { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../Components/Loading";
import Socket from "../../../Utils/Socket";
import {
  AppObjectType,
  AppPageType,
  DialogType,
  NavBarButtonType,
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
} from "@mui/material";
import { List } from "@mui/material";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { useGlobal } from "reactn";
import Icon from "../../../Components/Design/Icon";
import { AppContext } from "../../../Components/Context";
import { groupBy, map } from "lodash";
import { AppUtilsType } from "../../../App";
import { useSnackbar, VariantType } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextInput from "../../../Components/Inputs/Text";
import NumberInput from "../../../Components/Inputs/Number";
import slugify from "slugify";
import SelectInput from "../../../Components/Inputs/Select";
import BooleanInput from "../../../Components/Inputs/Boolean";
import Card from "../../../Components/Design/Card";

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
  setUpLink: (title?: string | (() => void)) => void;
  upLink?: string | (() => void);
  setHeaderIsIndented?: (isIndented: boolean) => void;
  addNavbarAction: (key: string, action: NavBarButtonType) => void;
  removeNavbarAction: (key: string) => void;
}> = ({
  appKey,
  utils,
  setPageName,
  pageName,
  setUpLink,
  upLink,
  setHeaderIsIndented,
  addNavbarAction,
  removeNavbarAction,
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
      const context = new AppContext(
        object,
        {
          navbar: {
            up: setUpLink,
            name: (pageName?: string) => setPageName(pageName || object.name),
            actions: {
              add: addNavbarAction,
              remove: removeNavbarAction,
            },
          },
          interact: {
            snackbar: (msg: string, variant?: VariantType) =>
              enqueueSnackbar(msg, { variant }),
            dialog: setDialog,
          },
        },
        utils
      );
      setContext(context);

      const appCode =
        require(`../../../AppDev/${object.key}/index.tsx`).default;

      // Get app pages (and sort them in groups)
      appCode.getPages(context).then((result: AppPageType[]) => {
        setPageMenu(groupBy(result, (o) => o.group));
        setFlatPageMenu(result);
      });
    };

    Socket.emit(
      "getObject",
      "apps",
      { key: appKey },
      (response: ResponseType) => {
        onReceive(response.object);
        Socket.on(`receive ${response.key}`, (response) =>
          onReceive(response.object)
        );
      }
    );

    return () => {
      utils.setPrimaryColor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [flatPageMenu, setHeaderIsIndented, setPageName]);

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
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="h6"
                  className={styles.appName}
                  style={{ color: `${colors.primary.hex()}`, height: 42 }}
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
            {map(flatPageMenu, (page: AppPageType) => {
              return (
                <Route
                  path={
                    page.altKeys
                      ? `/${appKey}/(${page.key}${page.altKeys?.map(
                          (altKey) => `|${altKey}`
                        )})`
                      : `/${appKey}/${page.key}`
                  }
                  render={(args) => {
                    setSelectedPage(page.key);
                    const Component = page.component;
                    return context ? (
                      <Component
                        context={context}
                        page={page}
                        selectedPageKey={
                          //@ts-ignore
                          args.match.params[0]
                        }
                      />
                    ) : (
                      <Loading />
                    );
                  }}
                />
              );
            })}
          </Switch>
        </div>
      </div>
      <Dialog
        open={dialog.display || false}
        onClose={() => setDialog({ ...dialog, display: false })}
        maxWidth={dialog.size || "md"}
        fullWidth={true}
        PaperComponent={Card}
        PaperProps={{
          //@ts-ignore
          withoutPadding: true,
          //@ts-ignore
          withoutMargin: true,
          title: dialog.title,
        }}
      >
        <DialogContent style={{ padding: dialog.withoutPadding && 0 }}>
          {dialog.text && (
            <DialogContentText style={{ margin: 0 }}>
              {dialog.text}
            </DialogContentText>
          )}
          {dialog.content && typeof dialog.content === "function"
            ? dialog.content(() => setDialog({ ...dialog, display: false }))
            : dialog.content}
          {dialog.fields && (
            <Grid container spacing={2}>
              {map(dialog.fields, (field, key) => {
                let displays = true;
                // If onlyDisplaysWhen is active we need to process the criteria and set displays to false if they don't meet
                if (field.onlyDisplayWhen) {
                  if (field.onlyDisplayWhen.and) {
                    map(field.onlyDisplayWhen.and, (val, key) => {
                      if (dialogFieldValues[key] !== val) {
                        displays = false; // One 'and' statement is false -> hide
                      }
                    });
                  }
                  if (field.onlyDisplayWhen.or) {
                    let orTruesHit = 0;
                    // eslint-disable-next-line array-callback-return
                    field.onlyDisplayWhen.or.map((orCondition) => {
                      map(orCondition, (value, key) => {
                        if (dialogFieldValues[key] !== value) {
                          orTruesHit++;
                        }
                      });

                      if (orTruesHit === field.onlyDisplayWhen?.or?.length) {
                        displays = false; // All 'or' statements are false -> hide
                      }
                    });
                  }
                }
                if (displays) {
                  return (
                    <Grid item key={key} xs={field.width || 12}>
                      {(!field.type ||
                        field.type === "text" ||
                        field.type === "key") && (
                        <TextInput
                          label={field.label}
                          value={
                            dialogFieldValues[key] ||
                            field.value ||
                            (dialog.actionValues || {})[key] ||
                            ""
                          }
                          keyMode={field.type === "key"}
                          onChange={(value) =>
                            setDialogFieldValues({
                              ...dialogFieldValues,
                              [key]: value,
                              ...(field.linkToKeyField
                                ? {
                                    [field.linkToKeyField]:
                                      slugify(value).toLowerCase(),
                                  }
                                : {}), // If we're linked to a key field, set the key as well
                            })
                          }
                        />
                      )}
                      {field.type === "number" && (
                        <NumberInput
                          label={field.label}
                          value={
                            dialogFieldValues[key] ||
                            field.value ||
                            (dialog.actionValues || {})[key] ||
                            ""
                          }
                          onChange={(value) =>
                            setDialogFieldValues({
                              ...dialogFieldValues,
                              [key]: field.valueModifier
                                ? field.valueModifier(value)
                                : value,
                            })
                          }
                        />
                      )}
                      {field.type === "options" && (
                        <SelectInput
                          options={field.options || []}
                          label={field.label}
                          value={
                            dialogFieldValues[key] ||
                            field.value ||
                            (dialog.actionValues || {})[key] ||
                            ""
                          }
                          onChange={(value) =>
                            setDialogFieldValues({
                              ...dialogFieldValues,
                              [key]: field.valueModifier
                                ? field.valueModifier(value as string)
                                : value,
                            })
                          }
                        />
                      )}
                      {field.type === "boolean" && (
                        <BooleanInput
                          label={field.label}
                          value={
                            dialogFieldValues[key] ||
                            field.value ||
                            (dialog.actionValues || {})[key] ||
                            ""
                          }
                          onChange={(value) =>
                            setDialogFieldValues({
                              ...dialogFieldValues,
                              [key]: field.valueModifier
                                ? field.valueModifier(value)
                                : value,
                            })
                          }
                          explanation={field.explanation}
                        />
                      )}
                      {field.type === "custom" && (
                        //@ts-ignore
                        <field.component
                          context={context}
                          value={
                            dialogFieldValues[key] ||
                            field.value ||
                            (dialog.actionValues || {})[key] ||
                            ""
                          }
                          onChange={(value: any) =>
                            setDialogFieldValues({
                              ...dialogFieldValues,
                              [key]: value,
                            })
                          }
                          {...field.componentProps}
                        />
                      )}
                    </Grid>
                  );
                }
              })}
            </Grid>
          )}
        </DialogContent>
        {dialog.actions && (
          <DialogActions>
            {dialog.actions.map((action) => (
              <Button
                onClick={() => {
                  map(dialog.fields, (field, key) => {
                    if (!dialogFieldValues[key] && field.value) {
                      dialogFieldValues[key] = field.value;
                    }
                  });
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
