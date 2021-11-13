import { Collapse, Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
  SelectOptionType,
} from "../../../../Utils/Types";
import DropTarget from "../DropTarget";
import LayoutItemComponent from "./index";

const ComponentPreviewGridContainer: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelList: ModelType[];
  modelListOptions: SelectOptionType[];
}> = ({
  context,
  layoutItem,
  layout,
  setLayout,
  variables,
  modelList,
  modelListOptions,
}) => {
  // Vars
  const [settingsOpen, setSettingsOpen] = useState<boolean>(
    layoutItem.args ? false : true
  );

  // Lifecycle

  // UI
  return (
    <>
      <span style={{ float: "right" }}>
        <Tooltip
          placement="bottom"
          title={settingsOpen ? "Close grid settings" : "Edit grid settings"}
        >
          <IconButton onClick={() => setSettingsOpen(!settingsOpen)}>
            <context.UI.Design.Icon
              icon={settingsOpen ? "times-circle" : "wrench"}
              size={15}
            />
          </IconButton>
        </Tooltip>
      </span>
      <Collapse in={settingsOpen} style={{ paddingBottom: 15 }}>
        <Divider />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <context.UI.Inputs.Select
              label="Direction"
              value={layoutItem.args?.direction || "row"}
              options={[
                { label: "Row", value: "row" },
                { label: "Row (reverse)", value: "row-reverse" },
                { label: "Column", value: "column" },
                { label: "Column (reverse)", value: "column-reverse" },
              ]}
              onChange={async (direction) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    direction,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <context.UI.Inputs.Select
              label="Justify"
              value={layoutItem.args?.justify || "center"}
              options={[
                { label: "Flex (start)", value: "flex-start" },
                { label: "Center", value: "center" },
                { label: "Flex (end)", value: "flex-end" },
                { label: "Space Between", value: "space-between" },
                { label: "Space Around", value: "space-around" },
                { label: "Space Evenly", value: "space-evenly" },
              ]}
              onChange={async (justify) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    justify,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <context.UI.Inputs.Select
              label="Align"
              value={layoutItem.args?.align || "center"}
              options={[
                { label: "Flex (start)", value: "flex-start" },
                { label: "Center", value: "center" },
                { label: "Flex (end)", value: "flex-end" },
                { label: "Strecht", value: "stretch" },
                { label: "Baseline", value: "baseline" },
              ]}
              onChange={async (align) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    align,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <context.UI.Inputs.Number
              label="Spacing"
              value={layoutItem.args?.spacing || 0}
              onChange={async (spacing) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    spacing,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
        </Grid>
      </Collapse>
      <Grid
        container
        direction={layoutItem.args?.direction || "row"}
        justifyContent={layoutItem.args?.justify || "center"}
        alignItems={layoutItem.args?.align || "center"}
        spacing={layoutItem.args?.spacing || 0}
        style={{ width: "100%" }}
      >
        <DropTarget
          id={layoutItem.key!}
          layout={layout}
          setLayout={setLayout}
          dropHint={layoutItem.items ? "More Grid Items" : "Grid Items"}
          accepts={["GridItem"]}
        >
          {(layoutItem.items || []).map((subLayoutItem, layoutItemIndex) => (
            <LayoutItemComponent
              layoutItem={subLayoutItem}
              context={context}
              key={`layoutItem-${layoutItemIndex}`}
              layout={layout || []}
              setLayout={setLayout}
              modelList={modelList}
              variables={variables}
              modelListOptions={modelListOptions}
            />
          ))}
        </DropTarget>
      </Grid>
    </>
  );
};

export default ComponentPreviewGridContainer;
