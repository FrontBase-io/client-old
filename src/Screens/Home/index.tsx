import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import styles from "./styles.module.scss";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { AppWidgetObjectType, ResponseType } from "../../Utils/Types";
import Server from "../../Utils/Socket";
import Loading from "../../Components/Loading";
import Widget from "../../Components/Widgets/widget";
import { find } from "lodash";
import Icon from "../../Components/Design/Icon/index";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import uniqid from "uniqid";

const HomeScreen: React.FC = () => {
  // Vars
  const [widgetList, setWidgetList] = useState<AppWidgetObjectType[]>();
  const [userWidgets, setUserWidgets] = useState<
    { id: string; widgetId: string }[]
  >([]);
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [width, setWidth] = useState<string>(
    window.innerWidth > 1200
      ? "lg"
      : window.innerWidth < 768
      ? window.innerWidth < 480
        ? "xs"
        : "sm"
      : "md"
  );

  // Lifecycle
  useEffect(() => {
    Server.emit("getObjects", "widgets", {}, (response: ResponseType) => {
      setWidgetList(response.objects);
      Server.on(`receive ${response.key}`, (response: ResponseType) =>
        setWidgetList(response.objects)
      );
    });

    Server.emit("getUserSetting", "home-widgets", (response: ResponseType) =>
      setUserWidgets(response.value)
    );
  }, []);
  // UI
  if (!widgetList) return <Loading />;
  return (
    <>
      <ResponsiveGridLayout
        className={styles.layout}
        rowHeight={30}
        style={{ height: "100%" }}
        width={1200}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        draggableHandle=".draggable"
        onBreakpointChange={(breakpoint) => {
          setWidth(breakpoint);
          console.log(`Width is now ${breakpoint}`);
        }}
        onLayoutChange={(layout, allLayouts) => {
          //console.log(layout, allLayouts);
        }}
      >
        {userWidgets?.map((widget) => {
          const widgetObject = find(
            widgetList,
            (o) => o._id === widget.widgetId
          );
          return (
            <div
              key={widget.id}
              data-grid={{ i: widget.id, x: 3, y: 3, w: 2, h: 15 }}
            >
              <Widget
                widget={{
                  label: widgetObject?.name || "Unknown widget",
                  widgetObject: widgetObject,
                }}
              />
            </div>
          );
        })}
      </ResponsiveGridLayout>{" "}
      <IconButton
        style={{ position: "absolute", top: 10, right: 10, color: "white" }}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          setPopoverAnchor(event.currentTarget);
        }}
      >
        <Icon icon="plus" />
      </IconButton>
      <Popover
        id="add-widget-popover"
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography variant="h6"> Add widget</Typography>
        <List>
          {widgetList.map((widget) => (
            <ListItem
              button
              onClick={() => {
                setUserWidgets([
                  ...(userWidgets || []),
                  { id: uniqid(), widgetId: widget._id },
                ]);
                setPopoverAnchor(null);
              }}
            >
              <ListItemText>{widget.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default HomeScreen;
