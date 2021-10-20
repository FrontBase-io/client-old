import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { map, remove } from "lodash";
import { AppContext } from "../../../../Components/Context";
import {
  ListItemType,
  ModelType,
  ModelListType,
  SelectOptionType,
  ProcessObjectType,
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
    SelectOptionType[]
  >([]);
  const [oneActionOptions, setOneActionOptions] = useState<SelectOptionType[]>(
    []
  );
  const [manyActionOptions, setManyActionOptions] = useState<
    SelectOptionType[]
  >([]);

  // Lifecycle
  useEffect(() => {
    setNewList(model.lists[selectedKey]);
    const newGlobalActionOptions: SelectOptionType[] = [];
    const newOneActionOptions: SelectOptionType[] = [];
    const newManyActionOptions: SelectOptionType[] = [];
    // Add base actions
    map(Actions, (action, actionKey) => {
      if (action.accepts.includes("None")) {
        newGlobalActionOptions.push({ label: action.label, value: actionKey });
      }
      if (action.accepts.includes("One")) {
        newOneActionOptions.push({ label: action.label, value: actionKey });
      }
      if (action.accepts.includes("Many")) {
        newManyActionOptions.push({ label: action.label, value: actionKey });
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
        (processObjects as ProcessObjectType[]).map((po) => {
          if ((po.triggers?.singleAction || []).length > 0) {
            newOneActionOptions.push({
              label: po.name,
              value: `process_${po._id}`,
            });
          }
          if ((po.triggers?.globalAction || []).length > 0) {
            newGlobalActionOptions.push({
              label: po.name,
              value: `process_${po._id}`,
            });
          }
          if ((po.triggers?.manyAction || []).length > 0) {
            newManyActionOptions.push({
              label: po.name,
              value: `process_${po._id}`,
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
        <Grid item xs={6}>
          <Animation.Item key="availableFields">
            <Card title="Available">
              <List>
                {map(
                  model.fields,
                  (field, key) =>
                    !newList.fields?.includes(key) && (
                      <ListItem key={key}>
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
        <Grid item xs={6}>
          <Animation.Item key="selectedFields">
            <Card title="Selected">
              <List>
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
        <Grid item xs={4}>
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
            >
              <context.UI.Inputs.Select
                label="Global"
                value={newList.actions?.global || []}
                multi
                options={globalActionOptions}
                onChange={(newVal) =>
                  setNewList({
                    ...newList,
                    //@ts-ignore
                    actions: {
                      ...(newList.actions || {}),
                      global: newVal as string[],
                    },
                  })
                }
              />
            </Card>
          </Animation.Item>
        </Grid>
        <Grid item xs={4}>
          <Animation.Item key="actionsSingle">
            <Card
              title="Actions (one selected)"
              onExplanation={() =>
                context.canvas.interact.dialog({
                  display: true,
                  title: "Actions (one selected)",
                  text: "These actions will be shown to the right of an object in the list (dot menu) as well as when exactly one object is selected.",
                  size: "xs",
                })
              }
            >
              <context.UI.Inputs.Select
                label="One"
                value={newList.actions?.single || []}
                multi
                options={oneActionOptions}
                onChange={(newVal) =>
                  setNewList({
                    ...newList,
                    //@ts-ignore
                    actions: {
                      ...(newList.actions || {}),
                      single: newVal as string[],
                    },
                  })
                }
              />
            </Card>
          </Animation.Item>
        </Grid>
        <Grid item xs={4}>
          <Animation.Item key="actionsMultiple">
            <Card
              title="Actions (multiple selected)"
              onExplanation={() =>
                context.canvas.interact.dialog({
                  display: true,
                  title: "Actions (multiple selected)",
                  text: "These actions will be shown once a user has selected multiple objects at the same time.",
                  size: "xs",
                })
              }
            >
              <context.UI.Inputs.Select
                label="Many"
                value={newList.actions?.many || []}
                multi
                options={manyActionOptions}
                onChange={(newVal) =>
                  setNewList({
                    ...newList,
                    //@ts-ignore
                    actions: {
                      ...(newList.actions || {}),
                      many: newVal as string[],
                    },
                  })
                }
              />
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
