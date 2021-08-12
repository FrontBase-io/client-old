import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Socket from "../../Utils/Socket";
import { AppObjectType, ResponseType } from "../../Utils/Types";
import AppsIcon from "@material-ui/icons/Apps";
const Desktop: React.FC = () => {
  // Vars
  const [apps, setApps] = useState<AppObjectType[]>([]);

  // Lifecycle
  useEffect(() => {
    Socket.emit("systemGetsObjects", "apps", {}, (response: ResponseType) => {
      if (response.success) {
        setApps(response.objects);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  return (
    <>
      Desktop layout
      <List>
        {apps.map((app) => (
          <ListItem button>
            <ListItemIcon>
              <AppsIcon color="primary" />
            </ListItemIcon>
            <ListItemText>{app.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Desktop;
