import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import Icon from "../../../Components/Design/Icon";
import { SystemTaskObjectType } from "../../../Utils/Types";

const SettingsUpdate: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars
  const [updateTask, setUpdateTask] = useState<
    SystemTaskObjectType | undefined | null
  >(undefined);

  // Lifecycle
  useEffect(() => {
    context.data.objects.getOne(
      "system-task",
      { done: false, type: "system-update" },
      (object) => setUpdateTask((object as SystemTaskObjectType) || null)
    );
  }, [context.data.objects]);

  // UI
  if (updateTask === undefined) return <context.UI.Loading />;
  return (
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
          {updateTask ? (
            <>
              <Box
                position="relative"
                display="inline-flex"
                style={{ width: "100%", left: 60, top: 25 }}
              >
                <CircularProgress
                  value={updateTask.progress}
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
                  >{`${Math.round(updateTask.progress)}%`}</Typography>
                </Box>
              </Box>
              <div style={{ textAlign: "center", marginTop: 35 }}>
                {(updateTask.log || [])[(updateTask.log || []).length - 1]}
              </div>
            </>
          ) : (
            <>
              <Avatar
                color="primary"
                style={{ width: 60, height: 60, margin: "15px auto" }}
              >
                <Icon icon="download" color="white" />
              </Avatar>
              <Typography>
                An automatic update occurs daily. However, you can push the
                button below to manually check for updates.
              </Typography>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                style={{ marginTop: 15 }}
                onClick={() =>
                  context.data.objects.create("system-task", {
                    type: "system-update",
                    description: "Update system",
                    progress: 0,
                    done: false,
                  })
                }
              >
                Update FrontBase
              </Button>
            </>
          )}
        </context.UI.Design.Card>
      </div>
    </context.UI.Design.Animation.Animate>
  );
};

export default SettingsUpdate;
