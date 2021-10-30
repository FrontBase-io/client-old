import React, { useEffect, useState } from "react";
import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import {
  AppBar,
  Button,
  ButtonGroup,
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { filter, find, map } from "lodash";
import { useHistory } from "react-router";
import FieldDisplay from "../../Data/FieldDisplay";
import Actions from "../../../../Actions";
import Icon from "../../../../Design/Icon";

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  // UI
  if (!model) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card withoutPadding>
        {(selectedItems || []).length < 2 ? (
          <div style={{ padding: "15px 15px 0 15px", boxSizing: "border-box" }}>
            {selectedList && model.lists[selectedList].actions && (
              <>
                {model.lists[selectedList].actions?.global && (
                  <div style={{ float: "right", padding: 5 }}>
                    <ButtonGroup color="primary">
                      {model.lists[selectedList].actions?.global?.map(
                        (action) => {
                          const Action = Actions[action.key];
                          return (
                            <Button
                              key={`button-${action.key}`}
                              onClick={() =>
                                Action.onClick(
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
                        }
                      )}
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
                    <List disablePadding>
                      <ListSubheader>Actions</ListSubheader>
                      {model.lists[selectedList].actions?.single?.map(
                        (action) => {
                          if (action.type === "process") {
                            return (
                              <ListItem
                                key={action.key}
                                button
                                onClick={() => {
                                  context.data.actions.executeSingleAction(
                                    action.key,
                                    find(
                                      objects!,
                                      (o) => o._id === selectedItems[0]
                                    ) as ObjectType
                                  );
                                  setSingleActionAnchorEl(null);
                                }}
                              >
                                <ListItemIcon style={{ minWidth: 24 }}>
                                  <Icon icon={action.icon} size={14} />
                                </ListItemIcon>
                                <ListItemText>{action.label}</ListItemText>
                              </ListItem>
                            );
                          } else {
                            const Action = Actions[action.key];
                            return (
                              <ListItem
                                key={`singleAction-${action.key}`}
                                button
                                onClick={() => {
                                  Action.onClick(
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
                                <ListItemIcon style={{ minWidth: 24 }}>
                                  <Icon icon={action.icon} size={14} />
                                </ListItemIcon>
                                <ListItemText>{action.label}</ListItemText>
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
          </div>
        ) : (
          <AppBar enableColorOnDark={true} position="static">
            <Toolbar color="primary">
              <Typography style={{ flex: "1" }}>
                <IconButton
                  onClick={() => setSelectedItems([])}
                  style={{ marginRight: 5, marginLeft: -15 }}
                >
                  <context.UI.Design.Icon icon="times" size={18} />
                </IconButton>
                {selectedItems?.length === objects?.length
                  ? "All"
                  : selectedItems?.length}{" "}
                {selectedItems?.length === 1 ? model.label : model.label_plural}{" "}
                selected
              </Typography>
              <div>
                {model.lists[selectedList!].actions?.many?.map((action) => {
                  if (action.type === "process") {
                    return (
                      <Tooltip
                        key={action.key}
                        title={action.label}
                        placement="bottom"
                      >
                        <IconButton
                          onClick={() => {
                            context.data.actions.executeManyAction(
                              action.key,
                              filter(objects!, (o) =>
                                selectedItems.includes(o._id)
                              ) as ObjectType[]
                            );
                            setSingleActionAnchorEl(null);
                          }}
                        >
                          <Icon icon={action.icon} size={18} color="white" />
                        </IconButton>
                      </Tooltip>
                    );
                  } else {
                    const Action = Actions[action.key];
                    return (
                      <Tooltip
                        key={action.key}
                        title={action.label}
                        placement="bottom"
                      >
                        <IconButton
                          onClick={() => {
                            Action.onClick(
                              context,
                              filter(objects!, (o) =>
                                selectedItems.includes(o._id)
                              ) as ObjectType[],
                              model
                            ).then(() => setSelectedItems([]));
                          }}
                        >
                          <Icon icon={action.icon} size={18} color="white" />
                        </IconButton>
                      </Tooltip>
                    );
                  }
                })}
              </div>
            </Toolbar>
          </AppBar>
        )}
        <Popover
          open={Boolean(listsAnchor)}
          anchorEl={listsAnchor}
          onClose={() => setListsAnchor(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          style={{ padding: 15 }}
          PaperProps={{
            elevation: 0,
            style: { backgroundColor: "transparent" },
          }}
        >
          <context.UI.Design.Card
            title="Lists"
            style={{ minWidth: 150 }}
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
              <ListItem button>
                <ListItemText>Create own list</ListItemText>
              </ListItem>
            </List>
          </context.UI.Design.Card>
        </Popover>
        {selectedList !== undefined && (
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedItems.length > 0 &&
                      selectedItems.length < (objects || []).length
                    }
                    checked={
                      selectedItems.length > 0 &&
                      selectedItems.length === (objects || []).length
                    }
                    onChange={(event) => {
                      if (event.currentTarget.checked) {
                        const newSelectedItems: string[] = [];
                        objects?.map((o) => newSelectedItems.push(o._id));
                        setSelectedItems(newSelectedItems);
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableCell>
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
                  <TableRow
                    key={object._id}
                    hover
                    selected={(selectedItems || []).includes(object._id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={(selectedItems || []).includes(object._id)}
                        onChange={(event) => {
                          if ((selectedItems || []).includes(object._id)) {
                            setSelectedItems(
                              filter(selectedItems, (o) => o !== object._id)
                            );
                          } else {
                            setSelectedItems([...selectedItems, object._id]);
                          }
                        }}
                      />
                    </TableCell>

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
                          if (selectedItems) setSelectedItems([object._id]);
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
