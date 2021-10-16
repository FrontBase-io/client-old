import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { AppContext } from "../../../Components/Context";
import Icon from "../../../Components/Design/Icon";
import styles from "./styles.module.scss";

const ProcessComponents: React.FC<{
  context: AppContext;
}> = ({ context }) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <List disablePadding>
      <ListSubheader>Data</ListSubheader>
      <ListItem
        className={styles.component}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
          onDragStart(event, "fetch_objects")
        }
        component="div"
        draggable
      >
        <ListItemIcon>
          <Icon icon="cubes" />
        </ListItemIcon>
        <ListItemText>Get object</ListItemText>
      </ListItem>
      <ListItem
        className={styles.component}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
          onDragStart(event, "create_objects")
        }
        component="div"
        draggable
      >
        <ListItemIcon>
          <Icon icon="plus-square" />
        </ListItemIcon>
        <ListItemText>Create object</ListItemText>
      </ListItem>
      <ListItem
        className={styles.component}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
          onDragStart(event, "update_objects")
        }
        component="div"
        draggable
      >
        <ListItemIcon>
          <Icon icon="exchange-alt" />
        </ListItemIcon>
        <ListItemText>Update object</ListItemText>
      </ListItem>
    </List>
  );
};

export default ProcessComponents;
