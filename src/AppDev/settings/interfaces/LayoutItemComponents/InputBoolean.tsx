import {
  Collapse,
  Divider,
  Grid,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
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
import ActionDesignerLauncher from "./ActionDesignerLauncher";

const ComponentPreviewInputBoolean: React.FC<{
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
        <div style={{ padding: 10 }}>
          <Grid container>
            <Grid item xs={12}>
              <context.UI.Inputs.Boolean
                label="Disabled"
                value={layoutItem.args?.disabled}
                onChange={async (disabled) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(
                    newLayout,
                    layoutItem.key!,
                    (item) => {
                      const newItem = item;
                      newItem!.args = {
                        ...(item!.args || {}),
                        disabled,
                      };
                      return newItem;
                    },
                    ["avatarElement"]
                  );
                  setLayout(newLayout);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <context.UI.Inputs.Boolean
                label="Value"
                value={layoutItem.args?.value}
                onChange={async (value) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(
                    newLayout,
                    layoutItem.key!,
                    (item) => {
                      const newItem = item;
                      newItem!.args = {
                        ...(item!.args || {}),
                        value,
                      };
                      return newItem;
                    },
                    ["avatarElement"]
                  );
                  setLayout(newLayout);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              On change
              <br />
              <ActionDesignerLauncher
                context={context}
                value={layoutItem.args?.onChange}
                onChange={async (onChange) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(
                    newLayout,
                    layoutItem.key!,
                    (item) => {
                      const newItem = item;
                      newItem!.args = {
                        ...(item!.args || {}),
                        onChange,
                      };
                      return newItem;
                    },
                    ["avatarElement"]
                  );
                  setLayout(newLayout);
                }}
                variables={{
                  ...variables,

                  currentInputValue: {
                    type: "boolean",
                    label: "Current input: Value",
                  },
                }}
                modelListOptions={modelListOptions}
              />
            </Grid>
          </Grid>
        </div>
      </Popover>
      <span
        style={{
          float: "right",
        }}
      >
        <Tooltip
          placement="bottom"
          title={
            Boolean(settingsAnchor)
              ? "Close layout settings"
              : "Edit layout settings"
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
      <context.UI.Inputs.Boolean label={layoutItem.args?.label} disabled />
    </>
  );
};

export default ComponentPreviewInputBoolean;
