import { Grid, IconButton, Popover, Tooltip } from "@mui/material";
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

const ComponentPreviewGridItem: React.FC<{
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
  const [settingsAnchor, setSettingsAnchor] =
    useState<HTMLButtonElement | null>();

  // Lifecycle

  // UI
  return (
    <>
      <Popover
        id="settings-popover"
        open={Boolean(settingsAnchor)}
        anchorEl={settingsAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => setSettingsAnchor(null)}
      >
        <Grid container spacing={1} style={{ padding: 10 }}>
          <Grid item xs={4}>
            <context.UI.Inputs.Number
              label="Extra Small"
              value={layoutItem.args?.xs || 12}
              onChange={async (value) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    xs: value > 0 ? (value < 13 ? value : 12) : 1,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <context.UI.Inputs.Number
              label="Small"
              value={layoutItem.args?.sm}
              onChange={async (value) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    sm: value > 0 ? (value < 13 ? value : 12) : 1,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <context.UI.Inputs.Number
              label="Medium"
              value={layoutItem.args?.md}
              onChange={async (value) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    md: value > 0 ? (value < 13 ? value : 12) : 1,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <context.UI.Inputs.Number
              label="Large"
              value={layoutItem.args?.lg}
              onChange={async (value) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    lg: value > 0 ? (value < 13 ? value : 12) : 1,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <context.UI.Inputs.Number
              label="Extra Large"
              value={layoutItem.args?.xl}
              onChange={async (value) => {
                const newLayout = cloneDeep(layout);
                modifyRecursive(newLayout, layoutItem.key!, (item) => {
                  const newItem = item;
                  newItem!.args = {
                    ...(item!.args || {}),
                    xl: value > 0 ? (value < 13 ? value : 12) : 1,
                  };
                  return newItem;
                });
                setLayout(newLayout);
              }}
            />
          </Grid>
        </Grid>
      </Popover>
      <Grid
        item
        xs={layoutItem.args?.xs}
        sm={layoutItem.args?.sm}
        md={layoutItem.args?.md}
        lg={layoutItem.args?.lg}
        xl={layoutItem.args?.xl}
      >
        <span style={{ float: "right" }}>
          <Tooltip
            placement="bottom"
            title={
              Boolean(settingsAnchor)
                ? "Close grid item settings"
                : "Edit grid item settings"
            }
          >
            <IconButton onClick={(e) => setSettingsAnchor(e.currentTarget)}>
              <context.UI.Design.Icon
                icon={Boolean(settingsAnchor) ? "times-circle" : "wrench"}
                size={18}
              />
            </IconButton>
          </Tooltip>
        </span>

        <DropTarget
          id={layoutItem.key!}
          layout={layout}
          setLayout={setLayout}
          dropHint={layoutItem.items ? "More Grid Content" : "Grid Content"}
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

export default ComponentPreviewGridItem;
