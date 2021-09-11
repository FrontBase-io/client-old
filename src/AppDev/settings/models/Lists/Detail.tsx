import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { map, remove } from "lodash";
import { AppContext } from "../../../../Components/Context";
import {
  ListItemType,
  ModelType,
  ModelListType,
} from "../../../../Utils/Types";
import { useEffect, useState } from "react";

const ModelListDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
  model: ModelType;
}> = ({
  context: {
    UI: {
      Design: { Animation, Card, Tabs, Icon },
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

  // Lifecycle
  useEffect(() => {
    setNewList(model.lists[selectedKey]);
  }, [model, selectedKey]);

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
            <Card title="Global actions">
              These actions will be shown when no objects are selected.
            </Card>
          </Animation.Item>
        </Grid>
        <Grid item xs={4}>
          <Animation.Item key="actionsSingle">
            <Card title="Actions (object selected)">
              These actions will be shown when one option is selected.
            </Card>
          </Animation.Item>
        </Grid>
        <Grid item xs={4}>
          <Animation.Item key="actionsMultiple">
            <Card title="Actions (multiple selected)">
              These actions will be shown when multiple objects are selected.
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
