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

const HomeScreen: React.FC = () => {
  // Vars
  const [widgetList, setWidgetList] = useState<AppWidgetObjectType[]>();
  const ResponsiveGridLayout = WidthProvider(Responsive);
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
  }, []);
  // UI
  if (!widgetList) return <Loading />;
  console.log(widgetList);
  return (
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
      <div key={"1"} data-grid={{ i: "c", x: 3, y: 3, w: 2, h: 15 }}>
        <Widget
          widget={{
            label: "TYest",
            widgetObject: find(
              widgetList,
              (o) => o._id === "61c9ad52fbc08f9a46263b71"
            ),
          }}
        />
      </div>
    </ResponsiveGridLayout>
  );
};

export default HomeScreen;
