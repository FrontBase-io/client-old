import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import Icon from "../../../Components/Design/Icon";
import { SystemTaskObjectType } from "../../../Utils/Types";

const SettingsUpdate: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars
  const [updateTask, setUpdateTask] = useState<
    SystemTaskObjectType | undefined | null
  >(undefined);
  const [finishedUpdateTask, setFinishedUpdateTask] = useState<
    SystemTaskObjectType | undefined | null
  >(undefined);

  // Lifecycle
  useEffect(() => {
    context.data.objects.getOne(
      "system-task",
      { done: false, type: "system-update" },
      (object) => setUpdateTask((object as SystemTaskObjectType) || null)
    );
    context.data.objects.getOne(
      "system-task",
      { done: true, type: "system-update" },
      (object) =>
        setFinishedUpdateTask((object as SystemTaskObjectType) || null)
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
                {(updateTask.log || [])[(updateTask.log || []).length - 1]
                  .label || ""}
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
              <Grid container>
                <Grid item xs={finishedUpdateTask ? 10 : 12}>
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
                </Grid>
                {finishedUpdateTask && (
                  <Grid item xs={2} style={{ paddingTop: 12 }}>
                    <Tooltip placement="right" title="View last task's log">
                      <IconButton
                        onClick={() =>
                          context.canvas.interact.dialog({
                            display: true,
                            title: "Last task log",
                            size: "xs",
                            content: () => (
                              <List disablePadding>
                                {(finishedUpdateTask.log || []).map(
                                  (
                                    logItem: { label: string; time: string },
                                    lii: number
                                  ) => (
                                    <ListItem
                                      key={`logitem-${lii}`}
                                      disablePadding
                                    >
                                      <ListItemText
                                        primary={logItem.label}
                                        secondary={format(
                                          parseISO(logItem.time),
                                          "LLL do (k:mm)"
                                        )}
                                      />
                                    </ListItem>
                                  )
                                )}
                              </List>
                            ),
                            actions: [
                              {
                                label: "Close",
                                onClick: (_, close) => close(),
                              },
                            ],
                          })
                        }
                      >
                        <Icon icon="history" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </context.UI.Design.Card>
      </div>
    </context.UI.Design.Animation.Animate>
  );
};

export default SettingsUpdate;
