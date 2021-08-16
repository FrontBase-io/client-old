import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../Components/Loading";
import Socket from "../../../Utils/Socket";
import { AppObjectType, AppPageType, ResponseType } from "../../../Utils/Types";
import Typography from "@material-ui/core/Typography";
const AppLayout: React.FC<{ appKey: string }> = ({ appKey }) => {
  // Vars
  const [app, setApp] = useState<AppObjectType>();
  const [pageMenu, setPageMenu] = useState<AppPageType[]>();

  // Lifecycle
  useEffect(() => {
    const onReceive = (object: AppObjectType) => {
      setApp(object);
    };
    const AppCode = require(`../../../AppDev/settings/index.tsx`).default;
    const appCode = new AppCode();

    appCode.getPages().then((result: AppPageType[]) => setPageMenu(result));

    Socket.emit(
      "systemGetsObject",
      "apps",
      { key: appKey },
      (response: ResponseType) => {
        onReceive(response.object);
        Socket.on(`receive ${response.key}`, onReceive);
      }
    );
  }, []);

  // UI
  if (!app || !pageMenu) return <Loading />;
  return (
    <Grid container>
      {pageMenu.length > 0 && (
        <Grid item xs={2}>
          <Typography
            variant="h5"
            style={{
              textAlign: "center",
              borderRight: "1px solid gray",
              height: "100vh",
              backgroundColor: "#9a9a9a",
            }}
          >
            {app.name}
          </Typography>
        </Grid>
      )}
      <Grid item xs={pageMenu.length > 0 ? 10 : 12}>
        {app.name}
      </Grid>
    </Grid>
  );
};

export default AppLayout;
