import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import ReactFlow, {
  Controls,
  MiniMap,
  removeElements,
  addEdge,
  ReactFlowProvider,
  Node,
} from "react-flow-renderer";
import { cloneDeep, find, map } from "lodash";
import {
  InterfaceobjectVariableType,
  SelectOptionType,
} from "../../../../Utils/Types";
import uniqid from "uniqid";
import { findIndex } from "lodash";

const InterfaceActionDesigner: React.FC<{
  context: AppContext;
  value: [];
  onChange: (newVal: any[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelListOptions: SelectOptionType[];
}> = ({ context, value, onChange, variables, modelListOptions }) => {
  // Vars
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElementOnCanvas, setSelectedElementOnCanvas] =
    useState<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>();
  const [addNodePopoverAnchor, setAddNodePopoverAnchor] =
    useState<HTMLButtonElement | null>(null);

  // Lifecycle
  useEffect(() => {
    if (!value) {
      onChange([
        {
          id: "input",
          type: "input",
          data: {
            label: "Start",
          },
          position: {
            x: 250,
            y: 0,
          },
        },
        {
          id: "output",
          type: "output",
          data: {
            label: "End",
          },
          position: {
            x: 250,
            y: 480,
          },
        },
      ]);
    }
  }, [value]);
  // UI
  return (
    <Grid container spacing={3} style={{ minHeight: 700 }}>
      <Grid item xs={12} md={9}>
        <ReactFlowProvider>
          <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
            <ReactFlow
              elements={value || []}
              deleteKeyCode={46}
              onConnect={(params) =>
                onChange(
                  //@ts-ignore
                  addEdge(
                    //@ts-ignore
                    {
                      ...params,
                      //@ts-ignore
                      arrowHeadType: "arrowclosed",
                      type: "step",
                    },
                    value
                  )
                )
              }
              onElementsRemove={(elementsToRemove) =>
                //@ts-ignore
                onChange(removeElements(elementsToRemove, value))
              }
              onNodeDragStop={(event, node) => {
                let newValue = cloneDeep(value);
                //@ts-ignore
                newValue[findIndex(newValue, (o) => o.id === node.id)] = node;
                onChange(newValue);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onLoad={(_reactFlowInstance) =>
                //@ts-ignore
                setReactFlowInstance(_reactFlowInstance)
              }
              snapToGrid={true}
              onNodeContextMenu={(event, node) => {
                event.preventDefault();
                //@ts-ignore
                setSelectedElementOnCanvas(event.currentTarget);
                setSelectedNode(node);
              }}
              onNodeDoubleClick={(event, node) => {
                setSelectedNode(node);
              }}
              onNodeDrag={(event, node) => {
                setSelectedNode(node);
              }}
            >
              <MiniMap
                nodeColor={(node) => {
                  switch (node.type) {
                    case "input":
                      return "red";
                    case "default":
                      return "#00ff00";
                    case "output":
                      return "rgb(0,0,255)";
                    default:
                      return "#eee";
                  }
                }}
                nodeStrokeWidth={3}
                style={{ position: "absolute", right: 0, top: 0 }}
              />
              <Controls />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </Grid>
      <Grid item xs={12} md={3}>
        <Button
          fullWidth
          onClick={(event) => setAddNodePopoverAnchor(event.currentTarget)}
          variant="contained"
        >
          Add node
        </Button>
        <Popover
          id="addnodepopover"
          open={Boolean(addNodePopoverAnchor)}
          anchorEl={addNodePopoverAnchor}
          onClose={() => setAddNodePopoverAnchor(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <List disablePadding dense>
            <ListSubheader>Data</ListSubheader>
            <ListItem
              button
              onClick={() => {
                setAddNodePopoverAnchor(null);
                onChange([
                  ...value,
                  {
                    id: uniqid(),
                    type: "default",
                    position: { x: 100, y: 250 },
                    data: {
                      type: "assign_values",
                      label: "Assign values",
                    },
                  },
                ]);
              }}
            >
              <ListItemIcon>
                <context.UI.Design.Icon icon="equals" />
              </ListItemIcon>
              <ListItemText
                primary="Assign value(s)"
                secondary="Set the values of given variables."
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setAddNodePopoverAnchor(null);

                onChange([
                  ...value,
                  {
                    id: uniqid(),
                    type: "default",
                    position: { x: 100, y: 250 },
                    data: {
                      type: "create_objects",
                      label: "Create objects",
                    },
                  },
                ]);
              }}
            >
              <ListItemIcon>
                <context.UI.Design.Icon icon="plus-circle" />
              </ListItemIcon>
              <ListItemText
                primary="Create object(s)"
                secondary="Insert one or more objects into the database."
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setAddNodePopoverAnchor(null);

                onChange([
                  ...value,
                  {
                    id: uniqid(),
                    type: "default",
                    position: { x: 100, y: 250 },
                    data: {
                      type: "update_objects",
                      label: "Update objects",
                    },
                  },
                ]);
              }}
            >
              <ListItemIcon>
                <context.UI.Design.Icon icon="pen-alt" />
              </ListItemIcon>
              <ListItemText
                primary="Update object(s)"
                secondary="Update values for one or more objects."
              />
            </ListItem>
          </List>
        </Popover>

        {selectedNode && (
          <context.UI.Design.Animation.Animate>
            <context.UI.Design.Card title={`${selectedNode.data.label} node`}>
              {selectedNode.data.type ? (
                selectedNode.data.type === "create_objects" ? (
                  <CreateObjectsSettings
                    context={context}
                    args={selectedNode.data.args}
                    onChange={(newArgs) => {
                      const newValue = value;
                      newValue[
                        //@ts-ignore
                        findIndex(newValue, (o) => o.id === selectedNode.id)
                        //@ts-ignore
                      ].data.args = newArgs;

                      onChange(newValue);
                    }}
                    modelListOptions={modelListOptions}
                    variables={variables}
                  />
                ) : selectedNode.data.type === "assign_values" ? (
                  <AssignValuesSettings
                    context={context}
                    args={selectedNode.data.args}
                    onChange={(newArgs) => {
                      const newValue = value;
                      newValue[
                        //@ts-ignore
                        findIndex(newValue, (o) => o.id === selectedNode.id)
                        //@ts-ignore
                      ].data.args = newArgs;

                      onChange(newValue);
                    }}
                    modelListOptions={modelListOptions}
                    variables={variables}
                  />
                ) : selectedNode.data.type === "update_objects" ? (
                  <UpdateObjectsSettings
                    context={context}
                    args={selectedNode.data.args}
                    onChange={(newArgs) => {
                      const newValue = value;
                      newValue[
                        //@ts-ignore
                        findIndex(newValue, (o) => o.id === selectedNode.id)
                        //@ts-ignore
                      ].data.args = newArgs;

                      onChange(newValue);
                    }}
                    modelListOptions={modelListOptions}
                    variables={variables}
                  />
                ) : (
                  `Unknown data type ${selectedNode.data.type}`
                )
              ) : (
                "No settings for this node."
              )}
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Animate>
        )}
      </Grid>
    </Grid>
  );
};

export default InterfaceActionDesigner;

interface CreateObjectsArgs {
  mode?: string;
  // Custom mode
  model?: string;
  newObject?: { [key: string]: any };
}

const CreateObjectsSettings: React.FC<{
  args: CreateObjectsArgs;
  onChange: (newArgs: CreateObjectsArgs) => void;
  context: AppContext;
  modelListOptions: SelectOptionType[];
  variables: { [key: string]: InterfaceobjectVariableType };
}> = ({ args, onChange, context, modelListOptions }) => {
  // UI
  return (
    <>
      <ToggleButtonGroup
        value={args?.mode || "v"}
        exclusive
        onChange={(_, mode) => onChange({ ...(args || {}), mode })}
        aria-label="Action mode"
      >
        <ToggleButton value="v" aria-label="Variable mode">
          Variable
        </ToggleButton>
        <ToggleButton value="m" aria-label="Manual mode">
          Manual
        </ToggleButton>
      </ToggleButtonGroup>
      <div>
        {(args?.mode || "v") === "v" && <>Variable mode</>}
        {args?.mode === "m" && (
          <>
            <context.UI.Inputs.Select
              label="Model"
              options={modelListOptions}
              value={args.model}
              onChange={(model) =>
                onChange({ ...(args || {}), model: model as string })
              }
            />
            {args?.model && (
              <context.UI.Objects.Designer
                context={context}
                mode="create"
                title="Object"
                value={args.newObject || {}}
                onChange={(newObject) =>
                  onChange({ ...(args || {}), newObject })
                }
                model={
                  find(modelListOptions, (o) => o.object!.key === args.model)!
                    .object
                }
              />
            )}
          </>
        )}
      </div>
    </>
  );
};
interface AssignValuesArgs {
  values: {
    [key: string]: string | { _form: string };
  };
}
const AssignValuesSettings: React.FC<{
  args: AssignValuesArgs;
  onChange: (newArgs: AssignValuesArgs) => void;
  context: AppContext;
  modelListOptions: SelectOptionType[];
  variables: { [key: string]: InterfaceobjectVariableType };
}> = ({ args, onChange, context, modelListOptions, variables }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <>
      <Table>
        <TableBody>
          {map(args?.values || {}, (varValue, varKey) => (
            <TableRow key={varKey}>
              <TableCell>
                {
                  //@ts-ignore
                  args?.values[varKey]._form ? (
                    <>Test</>
                  ) : variables[varKey].type === "objects" ||
                    variables[varKey].type === "object" ? (
                    "Todo: set objects"
                  ) : variables[varKey].type === "text" ? (
                    <context.UI.Inputs.Text
                      label={variables[varKey].label}
                      value={(args?.values[varKey] as string) || ""}
                      onChange={(newVal) =>
                        onChange({
                          ...args,
                          values: { ...args.values, [varKey]: newVal },
                        })
                      }
                    />
                  ) : (
                    `Unknown type ${variables[varKey].type}`
                  )
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <context.UI.Inputs.Select
        label="Add variable"
        options={context.utils.listifyObjectForSelect(variables, "label")}
        value="wrong"
        onChange={(newKey) =>
          onChange({
            ...(args || {}),
            values: {
              ...(args?.values || {}),
              [newKey as string]: "",
            },
          })
        }
      />
    </>
  );
};

interface UpdateObjectsArgs {
  mode?: string;
  // Custom mode
  model?: string;
  filter?: {};
  fields?: {};
}
const UpdateObjectsSettings: React.FC<{
  args: UpdateObjectsArgs;
  onChange: (newArgs: UpdateObjectsArgs) => void;
  context: AppContext;
  modelListOptions: SelectOptionType[];
  variables: { [key: string]: InterfaceobjectVariableType };
}> = ({ args, onChange, context, modelListOptions, variables }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <>
      <ToggleButtonGroup
        value={args?.mode || "v"}
        exclusive
        onChange={(_, mode) => onChange({ ...(args || {}), mode })}
        aria-label="Action mode"
      >
        <ToggleButton value="v" aria-label="Variable mode">
          Variable
        </ToggleButton>
        <ToggleButton value="m" aria-label="Manual mode">
          Manual
        </ToggleButton>
      </ToggleButtonGroup>
      <div>
        {(args?.mode || "v") === "v" && <>Variable mode</>}
        {args?.mode === "m" && (
          <>
            <context.UI.Inputs.Select
              label="Model"
              options={modelListOptions}
              value={args?.model}
              onChange={(model) =>
                onChange({ ...(args || {}), model: model as string })
              }
            />
            {args?.model && (
              <>
                <context.UI.Objects.Designer
                  context={context}
                  title="Objects to update"
                  value={args?.filter || {}}
                  withFormula
                  withId
                  onChange={(filter) => onChange({ ...(args || {}), filter })}
                  model={
                    find(modelListOptions, (o) => o.object!.key === args.model)!
                      .object
                  }
                />
                <context.UI.Objects.Designer
                  context={context}
                  title="Set values"
                  value={args?.fields || {}}
                  mode="create"
                  withFormula
                  onChange={(fields) => onChange({ ...(args || {}), fields })}
                  model={
                    find(modelListOptions, (o) => o.object!.key === args.model)!
                      .object
                  }
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
