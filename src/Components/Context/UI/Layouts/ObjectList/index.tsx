import React, { useEffect, useState } from "react";
import { AppContext } from "../../..";
import {
  ModelType,
  ObjectType,
  ProcessObjectType,
} from "../../../../../Utils/Types";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import {
  Button,
  ButtonGroup,
  IconButton,
  ListItem,
  ListItemText,
  ListSubheader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { filter, find, map } from "lodash";
import { useHistory } from "react-router";
import FieldDisplay from "../../Data/FieldDisplay";
import Actions from "../../../../Actions";

const ObjectList: React.FC<{
  context: AppContext;
  modelKey: string;
  model?: ModelType;
  baseUrl: string;
}> = ({ modelKey, baseUrl, model: inputModel, context }) => {
  // Vars
  const [model, setModel] = useState<ModelType>(inputModel!);
  const [objects, setObjects] = useState<ObjectType[]>();
  const [singleActionAnchorEl, setSingleActionAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [manyActionAnchorEl, setManyActionAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [availableProcesses, setAvailableProcesses] = useState<{
    [key: string]: ProcessObjectType;
  }>({});

  //- Lists
  const [selectedList, setSelectedList] = useState<string | undefined>();
  const [listsAnchor, setListsAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    if (inputModel) {
      context.data.models.get(modelKey, (model: ModelType) => {
        setModel(model);
        model.lists
          ? setSelectedList(Object.keys(model.lists)[0])
          : setSelectedList(undefined);
      });
    }
  }, [context.data.models, inputModel, modelKey]);
  useEffect(() => {
    if (model && selectedList) {
      context.data.objects.get(
        modelKey,
        model?.lists[selectedList].filter || {},
        (objects) => setObjects(objects)
      );
    }
  }, [model?.lists, selectedList, modelKey, model, context.data.objects]);
  useEffect(() => {
    if (model && selectedList) {
      // Fetch the relevant processes
      const processesToFetch: string[] = [];

      filter(
        [
          ...(model.lists[selectedList].actions?.global || []),
          ...(model.lists[selectedList].actions?.single || []),
          ...(model.lists[selectedList].actions?.many || []),
        ],
        (o) => o.match("process_")
      ).map((b) =>
        processesToFetch.push((b as string).replace("process_", ""))
      );
      context.data.objects.get(
        "process",
        { _id: { $in: processesToFetch } },
        (fetchedProcesses) => {
          const newProcesses: { [key: string]: ProcessObjectType } = {};
          fetchedProcesses.map((fp) => {
            newProcesses[fp._id] = fp as ProcessObjectType;
          });
          setAvailableProcesses(newProcesses);
        }
      );
    }
  }, [model.lists, selectedList]);

  // UI
  if (!model) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card>
        {selectedList && model.lists[selectedList].actions && (
          <>
            {model.lists[selectedList].actions?.global && (
              <div style={{ float: "right", padding: 5 }}>
                <ButtonGroup color="primary">
                  {model.lists[selectedList].actions?.global.map((button) => {
                    const action = Actions[button];
                    return (
                      <Button
                        key={`button-${button}`}
                        onClick={() =>
                          action.onClick(
                            context,
                            find(
                              objects!,
                              (o) => o._id === selectedItems[0]
                            ) as ObjectType,
                            model
                          )
                        }
                      >
                        {action.label}
                      </Button>
                    );
                  })}
                </ButtonGroup>
              </div>
            )}
            {model.lists[selectedList].actions?.single && (
              <Popover
                id="singleActions"
                open={Boolean(singleActionAnchorEl)}
                anchorEl={singleActionAnchorEl}
                onClose={() => setSingleActionAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <List>
                  <ListSubheader>Actions</ListSubheader>
                  {model.lists[selectedList].actions?.single.map(
                    (actionKey) => {
                      if (actionKey.match("process_")) {
                        const process =
                          availableProcesses[actionKey.replace("process_", "")];

                        if (process) {
                          return (
                            <ListItem
                              button
                              onClick={() => {
                                context.data.actions.executeSingleAction(
                                  process._id,
                                  find(
                                    objects!,
                                    (o) => o._id === selectedItems[0]
                                  ) as ObjectType
                                );
                                setSingleActionAnchorEl(null);
                              }}
                            >
                              <ListItemText>{process.name}</ListItemText>
                            </ListItem>
                          );
                        } else {
                          return (
                            <ListItem>
                              <ListItemText>...</ListItemText>
                            </ListItem>
                          );
                        }
                      } else {
                        const action = Actions[actionKey];
                        return (
                          <ListItem
                            key={`singleAction-${actionKey}`}
                            button
                            onClick={() => {
                              action.onClick(
                                context,
                                find(
                                  objects!,
                                  (o) => o._id === selectedItems[0]
                                ) as ObjectType,
                                model
                              );
                              setSingleActionAnchorEl(null);
                            }}
                          >
                            {action.label}
                          </ListItem>
                        );
                      }
                    }
                  )}
                </List>
              </Popover>
            )}
          </>
        )}
        <Typography variant="h6">{model.label_plural}</Typography>
        <Typography variant="body2" style={{ cursor: "pointer" }}>
          {model.lists && selectedList && (
            <span
              onClick={(event: React.MouseEvent<HTMLElement>) =>
                setListsAnchor(listsAnchor ? null : event.currentTarget)
              }
            >
              {model.lists[selectedList].label?.replace(
                "_name",
                model.label_plural
              )}{" "}
              <context.UI.Design.Icon icon="angle-down" size={12} />
            </span>
          )}
        </Typography>
        <Popover
          open={Boolean(listsAnchor)}
          anchorEl={listsAnchor}
          onClose={() => setListsAnchor(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          style={{ padding: 15 }}
          PaperProps={{
            elevation: 0,
            style: { backgroundColor: "transparent" },
          }}
        >
          <context.UI.Design.Card
            title="Lists"
            style={{ minWidth: 150, marginTop: -35 }}
            withoutPadding
          >
            <List disablePadding>
              <ListSubheader>Global lists</ListSubheader>
              {map(model.lists, (list, key) => (
                <ListItem
                  key={key}
                  button
                  selected={selectedList === key}
                  onClick={() => {
                    setSelectedList(key);
                    setListsAnchor(null);
                  }}
                >
                  <ListItemText>
                    {list.label?.replace("_name", model.label_plural)}
                  </ListItemText>
                </ListItem>
              ))}
              <ListSubheader>My lists</ListSubheader>
            </List>
          </context.UI.Design.Card>
        </Popover>
        {selectedList !== undefined && (
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {model.lists[selectedList].fields?.map((fieldKey) => {
                  const field = model.fields[fieldKey];
                  return (
                    <TableCell key={`field-${fieldKey}`}>
                      {field.label}
                    </TableCell>
                  );
                })}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {objects ? (
                objects.map((object, rowIndex) => (
                  <TableRow key={object._id} hover>
                    {model.lists[selectedList].fields?.map((fieldKey) => (
                      <TableCell
                        key={`row-${rowIndex}field-${fieldKey}`}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          history.push(`${baseUrl}/${model.key}/${object._id}`)
                        }
                      >
                        <FieldDisplay
                          context={context}
                          model={model}
                          object={object}
                          fieldKey={fieldKey}
                          withoutLabel
                        />
                      </TableCell>
                    ))}
                    <TableCell width={20}>
                      <IconButton
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          setSelectedItems([object._id]);
                          setSingleActionAnchorEl(event.currentTarget);
                        }}
                      >
                        <context.UI.Design.Icon icon="ellipsis-v" size={14} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <context.UI.Loading />
              )}
            </TableBody>
          </Table>
        )}
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default ObjectList;
