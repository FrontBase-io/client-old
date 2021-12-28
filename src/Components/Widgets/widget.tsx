import { IconButton, Tooltip } from "@mui/material";
import Card from "../Design/Card";
import Icon from "../Design/Icon";
import styles from "./styles.module.scss";
import { AppWidgetObjectType } from "../../Utils/Types";

interface WidgetType {
  label: string;
  widgetObject?: AppWidgetObjectType;
}
const Widget: React.FC<{ widget: WidgetType }> = ({ widget }) => {
  return (
    <Card
      withoutMargin
      className={styles.WidgetCard}
      hoverable
      title={<div className="draggable">{widget.label}</div>}
      titleSecondary={
        <Tooltip title="Settings" placement="left" arrow={true}>
          <IconButton>
            <Icon icon="cog" />
          </IconButton>
        </Tooltip>
      }
    >
      {JSON.stringify(widget.widgetObject)}
    </Card>
  );
};

export default Widget;
