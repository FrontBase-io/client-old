import { Collapse, Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
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
}> = ({ context, layoutItem, layout, setLayout, variables, modelList }) => {
  // Vars
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Lifecycle

  // UI
  return (
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
          title={settingsOpen ? "Close grid item settings" : "Edit grid item settings"}
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
        <Grid container spacing={1}>
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
      </Collapse>

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
          />
        ))}
      </DropTarget>
    </Grid>
  );
};

export default ComponentPreviewGridItem;
