import { AppContextType } from "@frontbase/types";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { AppObjectType, SystemTaskObjectType } from "../../../Utils/Types";
import { APIAppType } from "../Types";

const AppHubDetail: React.FC<{
  context: AppContextType;
  remoteApp: APIAppType;
}> = ({ context, remoteApp }) => {
  // Vars
  const [task, setTask] = useState<SystemTaskObjectType>();
  const [installedApp, setInstalledApp] = useState<AppObjectType>();
  const [foundTask, setFoundTask] = useState<boolean>(false);

  // Lifecycle
  useEffect(() => {
    context.data.objects.getLast(
      "system-task",
      { done: false, type: { $in: ["install-app", "uninstall-app"] } },
      (object) => {
        if (object) {
          setTask((object as SystemTaskObjectType) || null);
          setFoundTask(true);
        } else {
          if (foundTask) {
            window.location.reload();
          }
        }
      }
    );

    context.data.objects.getOne("app", { key: remoteApp.key }, (object) =>
      setInstalledApp(object as AppObjectType)
    );
  }, [foundTask]);
  useEffect(() => {
    context.canvas.navbar.name(remoteApp.name);
    context.canvas.navbar.up("/app-hub/hub");
    return () => {
      context.canvas.navbar.name();
      context.canvas.navbar.up(undefined);
    };
  }, [remoteApp]);

  // UI
  return task ? (
    <context.UI.Design.Animation.Animate>
      <div
        style={{
          height: "100%",
          padding: 0,
          margin: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <context.UI.Design.Card
          title="Update"
          style={{ width: 300, height: 270 }}
        >
          <>
            <Box
              position="relative"
              display="inline-flex"
              style={{ width: "100%", left: 60, top: 25 }}
            >
              <CircularProgress
                value={task.progress}
                color="primary"
                style={{ height: 150, width: 150 }}
              />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ right: 130 }}
              >
                <Typography
                  component="div"
                  color="textSecondary"
                  style={{ display: "block" }}
                >{`${Math.round(task.progress)}%`}</Typography>
              </Box>
            </Box>
            <div style={{ textAlign: "center", marginTop: 35 }}>
              {(task.log || [])[(task.log || []).length - 1]?.label || ""}
            </div>
          </>
        </context.UI.Design.Card>
      </div>
    </context.UI.Design.Animation.Animate>
  ) : (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card
        title={remoteApp.name}
        titleSecondary={
          <Button
            onClick={() => {
              if (installedApp) {
                context.canvas.interact.snackbar("Uninstalling", "default");
                context.data.objects.create("system-task", {
                  type: "uninstall-app",
                  done: false,
                  description: `Uninstalling ${remoteApp.name}`,
                  progress: 0,
                  log: [{ label: "Requested...", time: new Date() }],
                  args: { appKey: remoteApp.key },
                });
              } else {
                context.canvas.interact.snackbar("Installing", "default");
                context.data.objects.create("system-task", {
                  type: "install-app",
                  done: false,
                  description: `Installing ${remoteApp.name}`,
                  progress: 0,
                  log: [{ label: "Requested...", time: new Date() }],
                  args: { appKey: remoteApp.key },
                });
              }
            }}
          >
            {installedApp ? "Uninstall" : "Install"}
          </Button>
        }
      >
        {remoteApp.description}
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default AppHubDetail;
