import {
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { map, remove } from "lodash";
import { AppContext } from "../../../../Components/Context";
import {
  ListItemType,
  ModelType,
  ModelListType,
  ProcessObjectType,
  ModelListActionType,
} from "../../../../Utils/Types";
import { useEffect, useState } from "react";
import Actions from "../../../../Components/Actions";

const ModelListDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
  model: ModelType;
}> = ({
  context: {
    UI: {
      Design: { Animation, Card, Icon },
    },
  },
  selectedKey,
  context,
  model,
}) => {
  // Vars
  const [newList, setNewList] = useState<ModelListType>(
    model.lists[selectedKey]
  );
  const [globalActionOptions, setGlobalActionOptions] = useState<
    ModelListActionType[]
  >([]);
  const [oneActionOptions, setOneActionOptions] = useState<
    ModelListActionType[]
  >([]);
  const [manyActionOptions, setManyActionOptions] = useState<
    ModelListActionType[]
  >([]);

  // Lifecycle
  useEffect(() => {
    setNewList(model.lists[selectedKey]);
    const newGlobalActionOptions: ModelListActionType[] = [];
    const newOneActionOptions: ModelListActionType[] = [];
    const newManyActionOptions: ModelListActionType[] = [];
    // Add base actions
    map(Actions, (action, actionKey) => {
      if (action.accepts.includes("None")) {
        newGlobalActionOptions.push({
          key: actionKey,
          label: action.label,
          icon: action.icon,
          type: "action",
        });
      }
      if (action.accepts.includes("One")) {
        newOneActionOptions.push({
          key: actionKey,
          label: action.label,
          icon: action.icon,
          type: "action",
        });
      }
      if (action.accepts.includes("Many")) {
        newManyActionOptions.push({
          key: actionKey,
          label: action.label,
          icon: action.icon,
          type: "action",
        });
      }
    });

    // Add processes
    context.data.objects.get(
      "process",
      {
        $or: [
          {
            "triggers.singleAction": {
              $elemMatch: { modelKey: model.key },
            },
          },
          {
            "triggers.manyAction": {
              $elemMatch: { modelKey: model.key },
            },
          },
          {
            "triggers.globalAction": {
              $elemMatch: { modelKey: model.key },
            },
          },
        ],
      },
      (processObjects) => {
        // eslint-disable-next-line array-callback-return
        (processObjects as ProcessObjectType[]).map((po) => {
          if ((po.triggers?.singleAction || []).length > 0) {
            newOneActionOptions.push({
              label: po.name,
              key: po._id,
              type: "process",
              icon: "magic",
            });
          }
          if ((po.triggers?.globalAction || []).length > 0) {
            newGlobalActionOptions.push({
              label: po.name,
              key: po._id,
              type: "process",
              icon: "magic",
            });
          }
          if ((po.triggers?.manyAction || []).length > 0) {
            newManyActionOptions.push({
              label: po.name,
              key: po._id,
              type: "process",
              icon: "magic",
            });
          }
        });
        setOneActionOptions(newOneActionOptions);
        setGlobalActionOptions(newGlobalActionOptions);
        setManyActionOptions(newManyActionOptions);
      }
    );
  }, [context.data.objects, model, selectedKey]);

  // UI
  return (
    <Animation.Container>
      <Grid container>
        {(newList.fields || []).length > 0 && (
          <Grid item xs={12}>
            <Card>
              <Grid container>
                {(newList?.fields || []).map((field) => (
                  <Grid
                    item // @ts-ignore
                    xs={12 / (newList.fields || []).length}
                  >
                    {model.fields[field].label}
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Animation.Item key="availableFields">
            <Card title="Available">
              <List>
                {map(
                  model.fields,
                  (field, key) =>
                    !newList.fields?.includes(key) && (
                      <ListItem key={key} disablePadding>
                        <ListItemText>{field.label}</ListItemText>
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() =>
                              setNewList({
                                ...newList,
                                fields: [...(newList!.fields || []), key],
                              })
                            }
                          >
                            <Icon icon="chevron-right" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                )}
              </List>
            </Card>
          </Animation.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Animation.Item key="selectedFields">
            <Card title="Selected">
              <List disablePadding>
                {map(
                  model.fields,
                  (field, key) =>
                    newList.fields?.includes(key) && (
                      <ListItem key={key}>
                        <ListItemAvatar>
                          <IconButton
                            onClick={() => {
                              const newFields = newList.fields!;
                              remove(newFields, (o) => o === key);
                              setNewList({
                                ...newList,
                                fields: newFields,
                              });
                            }}
                          >
                            <Icon icon="chevron-left" />
                          </IconButton>
                        </ListItemAvatar>
                        <ListItemText>{field.label}</ListItemText>
                      </ListItem>
                    )
                )}
              </List>
            </Card>
          </Animation.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Animation.Item key="actionsGlobal">
            <Card
              title="Global actions"
              onExplanation={() =>
                context.canvas.interact.dialog({
                  display: true,
                  title: "Global actions",
                  text: "These actions will be shown when no objects are selected.",
                  size: "xs",
                })
              }
              withoutPadding
            >
              <List disablePadding>
                {newList.actions?.global?.map((action, actionIndex) => (
                  <ListItem
                    key={action.key}
                    button
                    onClick={() =>
                      context.canvas.interact.dialog({
                        display: true,
                        title: `Edit ${action.label}`,
                        size: "xs",
                        fields: {
                          label: { label: "Label", value: action.label },
                          icon: { label: "Icon", value: action.icon },
                        },
                        actions: [
                          {
                            label: "Update",
                            onClick: (form, close) => {
                              const newActions = newList.actions?.global || [];
                              newActions[actionIndex] = {
                                ...newActions[actionIndex],
                                label: form.label,
                                icon: form.icon,
                              };
                              setNewList({
                                ...newList,
                                actions: {
                                  ...newList.actions,
                                  global: newActions,
                                },
                              });
                              close();
                            },
                          },
                        ],
                      })
                    }
                  >
                    <ListItemIcon style={{ minWidth: 48 }}>
                      <Icon icon={action.icon} />
                    </ListItemIcon>
                    <ListItemText>{action.label}</ListItemText>
                  </ListItem>
                ))}
                <Divider />
                <ListItem
                  button
                  onClick={() =>
                    context.canvas.interact.dialog({
                      display: true,
                      title: "Add global action",
                      size: "xs",
                      withoutPadding: true,
                      content: (close) => (
                        <List disablePadding>
                          {globalActionOptions.map(
                            (option) =>
                              !(newList.actions?.global || [])
                                .map((o) => o.key)
                                .includes(option.key) && (
                                <ListItem
                                  button
                                  key={option.key}
                                  onClick={() => {
                                    setNewList({
                                      ...newList,
                                      actions: {
                                        ...newList.actions,
                                        global: [
                                          ...(newList.actions?.global || []),
                                          option,
                                        ],
                                      },
                                    });
                                    close();
                                  }}
                                >
                                  <ListItemIcon>
                                    <Icon icon={option.icon} />
                                  </ListItemIcon>
                                  <ListItemText>{option.label}</ListItemText>
                                </ListItem>
                              )
                          )}
                        </List>
                      ),
                    })
                  }
                >
                  <ListItemText>Add action</ListItemText>
                </ListItem>
              </List>
            </Card>
          </Animation.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Animation.Item key="actionsSingle">
            <Card
              title="Single actions"
              onExplanation={() =>
                context.canvas.interact.dialog({
                  display: true,
                  title: "Actions (one selected)",
                  text: "These actions will be shown to the right of an object in the list (dot menu) as well as when exactly one object is selected.",
                  size: "xs",
                })
              }
              withoutPadding
            >
              <List disablePadding>
                {newList.actions?.single?.map((action, actionIndex) => (
                  <ListItem
                    key={action.key}
                    button
                    onClick={() =>
                      context.canvas.interact.dialog({
                        display: true,
                        title: `Edit ${action.label}`,
                        size: "xs",
                        fields: {
                          label: { label: "Label", value: action.label },
                          icon: { label: "Icon", value: action.icon },
                        },
                        actions: [
                          {
                            label: "Update",
                            onClick: (form, close) => {
                              const newActions = newList.actions?.single || [];
                              newActions[actionIndex] = {
                                ...newActions[actionIndex],
                                label: form.label,
                                icon: form.icon,
                              };
                              setNewList({
                                ...newList,
                                actions: {
                                  ...newList.actions,
                                  single: newActions,
                                },
                              });
                              close();
                            },
                          },
                        ],
                      })
                    }
                  >
                    <ListItemIcon style={{ minWidth: 48 }}>
                      <Icon icon={action.icon} />
                    </ListItemIcon>
                    <ListItemText>{action.label}</ListItemText>
                  </ListItem>
                ))}
                <Divider />
                <ListItem
                  button
                  onClick={() =>
                    context.canvas.interact.dialog({
                      display: true,
                      title: "Add single action",
                      size: "xs",
                      withoutPadding: true,
                      content: (close) => (
                        <List disablePadding>
                          {oneActionOptions.map(
                            (option) =>
                              !(newList.actions?.single || [])
                                .map((o) => o.key)
                                .includes(option.key) && (
                                <ListItem
                                  button
                                  key={option.key}
                                  onClick={() => {
                                    setNewList({
                                      ...newList,
                                      actions: {
                                        ...newList.actions,
                                        single: [
                                          ...(newList.actions?.single || []),
                                          option,
                                        ],
                                      },
                                    });
                                    close();
                                  }}
                                >
                                  <ListItemIcon>
                                    <Icon icon={option.icon} />
                                  </ListItemIcon>
                                  <ListItemText>{option.label}</ListItemText>
                                </ListItem>
                              )
                          )}
                        </List>
                      ),
                    })
                  }
                >
                  <ListItemText>Add action</ListItemText>
                </ListItem>
              </List>
            </Card>
          </Animation.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Animation.Item key="actionsMultiple">
            <Card
              title="Many actions"
              onExplanation={() =>
                context.canvas.interact.dialog({
                  display: true,
                  title: "Actions (multiple selected)",
                  text: "These actions will be shown once a user has selected multiple objects at the same time.",
                  size: "xs",
                })
              }
              withoutPadding
            >
              <List disablePadding>
                {newList.actions?.many?.map((action, actionIndex) => (
                  <ListItem
                    key={action.key}
                    button
                    onClick={() =>
                      context.canvas.interact.dialog({
                        display: true,
                        title: `Edit ${action.label}`,
                        size: "xs",
                        fields: {
                          label: { label: "Label", value: action.label },
                          icon: { label: "Icon", value: action.icon },
                        },
                        actions: [
                          {
                            label: "Update",
                            onClick: (form, close) => {
                              const newActions = newList.actions?.many || [];
                              newActions[actionIndex] = {
                                ...newActions[actionIndex],
                                label: form.label,
                                icon: form.icon,
                              };
                              setNewList({
                                ...newList,
                                actions: {
                                  ...newList.actions,
                                  many: newActions,
                                },
                              });
                              close();
                            },
                          },
                        ],
                      })
                    }
                  >
                    <ListItemIcon style={{ minWidth: 48 }}>
                      <Icon icon={action.icon} />
                    </ListItemIcon>
                    <ListItemText>{action.label}</ListItemText>
                  </ListItem>
                ))}
                <Divider />
                <ListItem
                  button
                  onClick={() =>
                    context.canvas.interact.dialog({
                      display: true,
                      title: "Add many action",
                      size: "xs",
                      withoutPadding: true,
                      content: (close) => (
                        <List disablePadding>
                          {manyActionOptions.map(
                            (option) =>
                              !(newList.actions?.many || [])
                                .map((o) => o.key)
                                .includes(option.key) && (
                                <ListItem
                                  button
                                  key={option.key}
                                  onClick={() => {
                                    setNewList({
                                      ...newList,
                                      actions: {
                                        ...newList.actions,
                                        many: [
                                          ...(newList.actions?.many || []),
                                          option,
                                        ],
                                      },
                                    });
                                    close();
                                  }}
                                >
                                  <ListItemIcon>
                                    <Icon icon={option.icon} />
                                  </ListItemIcon>
                                  <ListItemText>{option.label}</ListItemText>
                                </ListItem>
                              )
                          )}
                        </List>
                      ),
                    })
                  }
                >
                  <ListItemText>Add action</ListItemText>
                </ListItem>
              </List>
            </Card>
          </Animation.Item>
        </Grid>
        {JSON.stringify(model.lists[selectedKey]) !==
          JSON.stringify(newList) && (
          <Grid item xs={12}>
            <Animation.Item key="button">
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() =>
                  context.data.models.update({
                    ...model,
                    lists: {
                      ...model.lists,
                      [selectedKey]: newList,
                    },
                  })
                }
              >
                Save
              </Button>
            </Animation.Item>
          </Grid>
        )}
      </Grid>
    </Animation.Container>
  );
};

export default ModelListDetail;
