import {
  Collapse,
  Divider,
  Grid,
  IconButton,
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
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Lifecycle

  // UI
  return (
    <>
      <span
        style={{
          float: "right",
        }}
      >
        <Tooltip
          placement="bottom"
          title={
            settingsOpen ? "Close checkbox settings" : "Edit checkbox settings"
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
      <Collapse
        in={settingsOpen}
        style={{
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: 8,
        }}
      >
        <Typography variant="h6">Input settings</Typography>
        <Divider />
        <div style={{ padding: "5px 0" }}>Test</div>
        <Divider />
      </Collapse>

      <context.UI.Inputs.Boolean label={layoutItem.args?.label} disabled />
    </>
  );
};

export default ComponentPreviewInputBoolean;
