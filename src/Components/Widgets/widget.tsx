import { IconButton, List, ListItem, Popover, Tooltip } from "@mui/material";
import Card from "../Design/Card";
import Icon from "../Design/Icon";
import styles from "./styles.module.scss";
import {
  AppWidgetObjectSettingType,
  AppWidgetObjectType,
  ResponseType,
  SelectOptionType,
} from "../../Utils/Types";
import { useEffect, useState } from "react";
import { map } from "lodash";
import SelectInput from "../Inputs/Select/index";
import Server from "../../Utils/Socket";
import { listifyForSelect } from "../Context/Utils/index";
import { ModelType } from "@frontbase/types";

interface WidgetType {
  label: string;
  widgetObject?: AppWidgetObjectType;
}
const Widget: React.FC<{ widget: WidgetType }> = ({ widget }) => {
  // Vars
  const [popoverElement, setPopoverElement] =
    useState<HTMLButtonElement | null>(null);

  // Lifecycle
  // UI
  return (
    <>
      <Card
        withoutMargin
        className={styles.WidgetCard}
        hoverable
        title={<div className="draggable">{widget.label}</div>}
        titleSecondary={
          <Tooltip title="Settings" placement="left" arrow={true}>
            <IconButton
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setPopoverElement(event.currentTarget);
              }}
            >
              <Icon icon="cog" />
            </IconButton>
          </Tooltip>
        }
      >
        Widget goes here.
      </Card>
      <Popover
        id="widget-options"
        open={Boolean(popoverElement)}
        anchorEl={popoverElement}
        onClose={() => setPopoverElement(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        elevation={0}
        PaperProps={{
          style: { backgroundColor: "transparent", margin: "0 25px" },
        }}
      >
        <Card title="Widget settings">
          <List>
            {map(widget.widgetObject?.settings, (setting) => (
              <ListItem>
                {setting.type === "dropdown" ? (
                  <WidgetSettingsDropdown setting={setting} />
                ) : (
                  "Unknown type"
                )}
              </ListItem>
            ))}
          </List>
        </Card>
      </Popover>
    </>
  );
};

export default Widget;

// Widget settings helpers

// Dropdown
const WidgetSettingsDropdown: React.FC<{
  setting: AppWidgetObjectSettingType;
}> = ({ setting }) => {
  // Vars
  const [options, setOptions] = useState<SelectOptionType[]>([]);
  // Lifecycle
  useEffect(() => {
    if (setting.dynamicOptions) {
      // Fetch model (for primary) and objects
      Server.emit(
        "getModel",
        setting.dynamicOptions.model,
        (response: ResponseType) => {
          const model: ModelType = response.model;
          Server.emit(
            "getObjects",
            setting.dynamicOptions?.model,
            {},
            (response: ResponseType) => {
              setOptions(
                listifyForSelect(response.objects, model.primary, model.key)
              );
              Server.on(`receive ${response.key}`, (response: ResponseType) =>
                setOptions(
                  listifyForSelect(response.objects, model.primary, model.key)
                )
              );
            }
          );
        }
      );
    } else {
      // Static options
    }
  }, [setting]);

  // UI
  return <SelectInput label={setting.label} options={options} fullWidth />;
};
