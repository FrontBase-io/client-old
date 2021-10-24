import {
  BottomNavigation,
  BottomNavigationAction,
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
import { AppUtilsType } from "../../../App";
import { AppContext } from "../../../Components/Context";
import Card from "../../../Components/Design/Card";
import Icon from "../../../Components/Design/Icon";
import FourOhFour from "../../../Components/FourOhFour";
import Loading from "../../../Components/Loading";
import Socket from "../../../Utils/Socket";
import {
  AppObjectType,
  AppPageType,
  DialogType,
  NavBarButtonType,
} from "../../../Utils/Types";

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

      const appCode =
        require(`../../../AppDev/${object.key}/index.tsx`).default;
      setAppConfig(appCode.settings);

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
        <Route component={FourOhFour} />
      </Switch>
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
            style={{ position: "absolute", bottom: 0, width: "100vw" }}
          >
            {flatPageMenu?.slice(0, 4).map((page) => (
              <BottomNavigationAction
                label={page.label}
                icon={<Icon icon={page.icon} />}
                value={page.key}
                key={page.key}
              />
            ))}
            {(flatPageMenu || []).length > 5 && (
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
