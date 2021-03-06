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

const ComponentPreviewInputText: React.FC<{
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <context.UI.Inputs.Text
                label="Label"
                value={layoutItem.args?.label}
                onChange={async (label) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(newLayout, layoutItem.key!, (item) => {
                    const newItem = item;
                    newItem!.args = {
                      ...(item!.args || {}),
                      label,
                    };
                    return newItem;
                  });
                  setLayout(newLayout);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <context.UI.Inputs.Text
                label="Placeholder"
                value={layoutItem.args?.placeholder}
                onChange={async (placeholder) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(newLayout, layoutItem.key!, (item) => {
                    const newItem = item;
                    newItem!.args = {
                      ...(item!.args || {}),
                      placeholder,
                    };
                    return newItem;
                  });
                  setLayout(newLayout);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <context.UI.Inputs.Boolean
                label="Autofocus"
                value={layoutItem.args?.autofocus}
                onChange={async (autofocus) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(newLayout, layoutItem.key!, (item) => {
                    const newItem = item;
                    newItem!.args = {
                      ...(item!.args || {}),
                      autofocus,
                    };
                    return newItem;
                  });
                  setLayout(newLayout);
                }}
              />
            </Grid>
            <Divider />
            <Grid item xs={12}>
              <Typography variant="h6">Events</Typography>
            </Grid>
            <Grid item xs={12}>
              On enter
              <br />
              <ActionDesignerLauncher
                context={context}
                value={layoutItem.args?.onEnter}
                onChange={async (onEnter) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(newLayout, layoutItem.key!, (item) => {
                    const newItem = item;
                    newItem!.args = {
                      ...(item!.args || {}),
                      onEnter,
                    };
                    return newItem;
                  });
                  setLayout(newLayout);
                }}
                variables={{
                  ...variables,
                  currentInputKey: {
                    type: "text",
                    label: "Current input: Key",
                  },
                  currentInputValue: {
                    type: "text",
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

      <context.UI.Inputs.Text
        label={layoutItem.args?.label}
        placeholder={layoutItem.args?.placeholder}
        autoFocus={layoutItem.args?.autofocus}
        disabled
      />
    </>
  );
};

export default ComponentPreviewInputText;
