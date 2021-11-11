import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { AppContext } from "../../../../Components/Context";
import Icon from "../../../../Components/Design/Icon";
import styles from "./styles.module.scss";

const ActionComponents: React.FC = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <List disablePadding dense>
      <ListSubheader>Data</ListSubheader>
      <ListItem
        className={styles.component}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
          onDragStart(event, "get_objects")
        }
        component="div"
        draggable
      >
        <ListItemIcon>
          <Icon icon="cubes" />
        </ListItemIcon>
        <ListItemText
          primary="Get objects"
          secondary="Fetch objects from the database."
        />
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
        <ListItemText
          primary="Create object"
          secondary="Turn object variables into a new object in the database."
        />
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
        <ListItemText
          primary="Update objects"
          secondary="Save object variables to the database"
        />
      </ListItem>
      <ListItem
        className={styles.component}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
          onDragStart(event, "delete_objects")
        }
        component="div"
        draggable
      >
        <ListItemIcon>
          <Icon icon="trash" />
        </ListItemIcon>
        <ListItemText
          primary="Delete objects"
          secondary="Delete objects from the database"
        />
      </ListItem>
      <ListItem
        className={styles.component}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
          onDragStart(event, "assign_values")
        }
        component="div"
        draggable
      >
        <ListItemIcon>
          <Icon icon="equals" />
        </ListItemIcon>
        <ListItemText
          primary="Assign values"
          secondary="Assign values to variables."
        />
      </ListItem>
      <ListSubheader>Logic</ListSubheader>
      <ListItem
        className={styles.component}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
          onDragStart(event, "conditions")
        }
        component="div"
        draggable
      >
        <ListItemIcon>
          <Icon icon="bezier-curve" />
        </ListItemIcon>
        <ListItemText
          primary="Conditions"
          secondary="Set multiple conditions and only evaluate the one that's truthy."
        />
      </ListItem>
      <ListItem
        className={styles.component}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
          onDragStart(event, "await")
        }
        component="div"
        draggable
      >
        <ListItemIcon>
          <Icon icon="history" />
        </ListItemIcon>
        <ListItemText
          primary="Await state"
          secondary="Awaits an object's state and proceeds once it's achieved."
        />
      </ListItem>
    </List>
  );
};

export default ActionComponents;
