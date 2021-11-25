import { AppContextType } from "@frontbase/types";
import { Grid } from "@mui/material";
import { find } from "lodash";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppPageType } from "../../../Utils/Types";
import { APIAppType } from "../Types";
import AppHubDetail from "./Detail";

const AppHub: React.FC<{
  context: AppContextType;
  page: AppPageType;
  selectedPageKey: string;
}> = ({ context, page, selectedPageKey }) => {
  // Vars
  const [apps, setApps] = useState<APIAppType[]>();

  // Lifecycle
  useEffect(() => {
    fetch("https://frontbase.vtvc.nl/api/frontbase-apps/read")
      .then((response) => {
        response.json().then((fetchedApps) => setApps(fetchedApps));
      })
      .then((data) => console.log(data));
  }, []);

  // UI
  if (!apps) return <context.UI.Loading />;
  return window.location.href.split("/app-hub/hub/")[1] ? (
    <AppHubDetail
      remoteApp={
        find(
          apps,
          (o) => o.key === window.location.href.split("/app-hub/hub/")[1]
        )!
      }
      context={context}
    />
  ) : (
    <context.UI.Design.Animation.Container>
      <Grid container>
        {apps.map((app) => (
          <Grid item xs={12} md={6} lg={3} key={app.key}>
            <context.UI.Design.Animation.Item key={app.key}>
              <Link to={`/app-hub/hub/${app.key}`}>
                <context.UI.Design.Card
                  title={app.name}
                  style={{ cursor: "pointer" }}
                  image={`https://frontbase.vtvc.nl${app.image}`}
                  withoutPadding
                >
                  <div style={{ padding: "0 10px 5px 10px" }}>
                    {app.summary}
                  </div>
                </context.UI.Design.Card>
              </Link>
            </context.UI.Design.Animation.Item>
          </Grid>
        ))}
      </Grid>
    </context.UI.Design.Animation.Container>
  );
};

export default AppHub;
