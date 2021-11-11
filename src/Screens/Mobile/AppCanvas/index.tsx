import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import { groupBy, map } from "lodash";
import { useSnackbar, VariantType } from "notistack";
import { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { useGlobal } from "reactn";
import slugify from "slugify";
import { AppUtilsType } from "../../../App";
import { AppContext } from "../../../Components/Context";
import Card from "../../../Components/Design/Card";
import Icon from "../../../Components/Design/Icon";
import FourOhFour from "../../../Components/FourOhFour";
import BooleanInput from "../../../Components/Inputs/Boolean";
import NumberInput from "../../../Components/Inputs/Number";
import SelectInput from "../../../Components/Inputs/Select";
import TextInput from "../../../Components/Inputs/Text";
import Loading from "../../../Components/Loading";
import Socket from "../../../Utils/Socket";
import {
  AppObjectType,
  AppPageType,
  DialogType,
  NavBarButtonType,
} from "../../../Utils/Types";
import styles from "./styles.module.scss";

const AppCanvas: React.FC<{
  appKey: string;
  utils: AppUtilsType;
  setPageName: (title: string) => void;
  pageName: string;
  setUpLink: (title?: string | (() => void)) => void;
  upLink?: string | (() => void);
  addNavbarAction: (key: string, action: NavBarButtonType) => void;
  removeNavbarAction: (key: string) => void;
}> = ({
  appKey,
  utils,
  setPageName,
  pageName,
  setUpLink,
  upLink,
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
  const [appConfig, setAppConfig] = useState<{
    pages?: {
      searchable?: boolean;
      groups?: { enabled?: boolean; collapsible?: boolean };
    };
    mobile?: { pages?: "bottom" };
  }>({});
  const [bottomTabsMoreEl, setBottomTabsMoreEl] =
    useState<HTMLDivElement | null>(null);

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

      const appCode = require(`../../../AppDev/${
        object.type === "collection" ? "collection" : object.key
      }/index.tsx`).default;
      setAppConfig(appCode.settings);
      // Get app pages (and sort them in groups)
      appCode.getPages(context, object).then((result: AppPageType[]) => {
        setPageMenu(
          appCode.settings?.pages?.groups?.enabled
            ? groupBy(result, (o) => o.group)
            : result
        );
        setFlatPageMenu(result);
      });
    };

    Socket.emit(
      "getObject",
      "apps",
      { key: appKey },
      (response: ResponseType) => {
        //@ts-ignore
        onReceive(response.object);
        //@ts-ignore
        Socket.on(`receive ${response.key}`, (response) =>
          onReceive(response.object)
        );
      }
    );

    return () => {
      utils.setPrimaryColor();
      setPageName("FrontBase");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appKey]);
  return (
    <>
      <div
        className={styles.canvas}
        style={{
          paddingBottom: 64,
        }}
      >
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
                      {...(page.props || {})}
                    />
                  ) : (
                    <Loading />
                  );
                }}
              />
            );
          })}
          <Route component={FourOhFour} />
        </Switch>
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
      {appConfig.mobile?.pages === "bottom" && (
        <>
          <BottomNavigation
            showLabels
            value={
              window.location.href.match(`/${appKey}/`) &&
              window.location.href.split(`/${appKey}.`)[1]
            }
            onChange={(event, newValue) => {
              if (newValue === 4) {
                //@ts-ignore
                setBottomTabsMoreEl(event.target);
              } else {
                history.push(`/${appKey}/${newValue}`);
              }
            }}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100vw",
              zIndex: 50,
            }}
          >
            {flatPageMenu?.slice(0, 4).map((page) => (
              <BottomNavigationAction
                label={page.label}
                icon={<Icon icon={page.icon} />}
                value={page.key}
                key={page.key}
              />
            ))}
            {(flatPageMenu || []).length > 4 && (
              <BottomNavigationAction
                label="More"
                icon={<Icon icon="ellipsis-v" />}
              />
            )}
          </BottomNavigation>
          <Popover
            id="bottom-navigation-overflow"
            open={Boolean(bottomTabsMoreEl)}
            anchorEl={bottomTabsMoreEl}
            onClose={() => setBottomTabsMoreEl(null)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            PaperProps={{
              elevation: 0,
              style: { backgroundColor: "transparent" },
            }}
          >
            <Card title="Test" withoutPadding>
              <List disablePadding>
                {flatPageMenu?.slice(4, flatPageMenu.length).map((page) => (
                  <ListItem
                    button
                    key={page.key}
                    onClick={() => {
                      setBottomTabsMoreEl(null);
                      history.push(`/${appKey}/${page.key}`);
                    }}
                  >
                    <ListItemIcon style={{ minWidth: 24, marginRight: 15 }}>
                      <Icon icon={page.icon} />
                    </ListItemIcon>
                    <ListItemText>{page.label}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Popover>
        </>
      )}
    </>
  );
};

export default AppCanvas;
