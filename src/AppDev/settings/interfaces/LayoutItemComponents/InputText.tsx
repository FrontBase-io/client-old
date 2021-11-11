import { Collapse, Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { AppContext } from "../../../../Components/Context";
import TextInput from "../../../../Components/Inputs/Text";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
} from "../../../../Utils/Types";
import DropTarget from "../DropTarget";
import LayoutItemComponent from "./index";

const ComponentPreviewInputText: React.FC<{
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
    <>
      <span style={{ float: "right" }}>
        <Tooltip
          placement="bottom"
          title={
            settingsOpen
              ? "Close input text settings"
              : "Edit input text settings"
          }
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
        <div style={{ padding: "5px 0" }}>
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
          </Grid>
        </div>
        <Divider />
      </Collapse>

      <context.UI.Inputs.Text
        label={layoutItem.args?.label}
        placeholder={layoutItem.args?.placeholder}
        disabled
      />
    </>
  );
};

export default ComponentPreviewInputText;
