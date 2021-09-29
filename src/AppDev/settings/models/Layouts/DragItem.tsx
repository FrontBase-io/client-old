import { ListItem, ListItemIcon } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { FC } from "react";
import { DragSourceMonitor, ConnectDragSource } from "react-dnd";
import { DragSource, DragSourceConnector } from "react-dnd";
import Icon from "../../../../Components/Design/Icon";
import { LayoutItemType } from "../../../../Utils/Types";
import styles from "./styles.module.scss";

export interface BoxProps {
  layoutItem: LayoutItemType;
  icon: string;
  label: string;

  // Collected Props
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}
const Box: FC<BoxProps> = ({
  layoutItem,
  icon,
  label,
  isDragging,
  connectDragSource,
}) => {
  const opacity = isDragging ? 0.4 : 1;
  return (
    <ListItem
      ref={connectDragSource}
      role="component"
      className={styles.dragItem}
      style={{ opacity }}
    >
      <ListItemIcon>
        <Icon icon={icon} />
      </ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </ListItem>
  );
};

export default DragSource(
  "component",
  {
    beginDrag: (props: BoxProps) => {
      return {
        layoutItem: props.layoutItem,
        label: props.label,
        icon: props.icon,
      };
    },
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  }
)(Box);
