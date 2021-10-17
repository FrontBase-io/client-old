import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
} from "@mui/material";
import {
  ListDetailType,
  ProcesLogicStepItemType,
  ProcessObjectType,
} from "../../../Utils/Types";
import ReactFlow, {
  Controls,
  MiniMap,
  removeElements,
  addEdge,
  ReactFlowProvider,
  Node,
} from "react-flow-renderer";
import { useEffect, useRef, useState } from "react";
import { isEqual } from "lodash";
import ProcessVariables from "./Variables";
import ProcessComponents from "./Components";
import uniqid from "uniqid";
import Icon from "../../../Components/Design/Icon";
import FourOhFour from "../../../Components/FourOhFour";
import EditAssignValuesNode from "./EditNodes/AssignValues";

const ProcessDetail: React.FC<ListDetailType> = ({ context, item }) => {
  // Vars
  const [newObject, setNewObject] = useState<ProcessObjectType>();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElementOnCanvas, setSelectedElementOnCanvas] =
    useState<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>();

  // Lifecycle
  useEffect(() => {
    setNewObject(item.object);
  }, [item]);

  // UI
  if (!newObject) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Container>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={9} style={{ height: "100%" }}>
          <context.UI.Design.Animation.Item
            key="process-canvas"
            style={{ height: "100%" }}
          >
            <context.UI.Design.Card
              style={{ height: "calc(100% - 120px)", marginBottom: 100 }}
              withoutPadding
            >
              <ReactFlowProvider>
                <div
                  ref={reactFlowWrapper}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ReactFlow
                    elements={newObject?.logic}
                    onConnect={(params) =>
                      setNewObject({
                        ...newObject,
                        //@ts-ignore
                        logic: addEdge(
                          //@ts-ignore
                          {
                            ...params,
                            //@ts-ignore
                            arrowHeadType: "arrowclosed",
                            animated: true,
                            type: "step",
                          },
                          newObject.logic
                        ),
                      })
                    }
                    deleteKeyCode={46}
                    onElementsRemove={(elementsToRemove) =>
                      setNewObject({
                        ...newObject,
                        //@ts-ignore
                        logic: removeElements(
                          elementsToRemove,
                          newObject.logic
                        ),
                      })
                    }
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const reactFlowBounds =
                        //@ts-ignore
                        reactFlowWrapper.current?.getBoundingClientRect();
                      const type = event.dataTransfer.getData(
                        "application/reactflow"
                      );
                      //@ts-ignore
                      const position = reactFlowInstance?.project({
                        x: event.clientX - reactFlowBounds.left,
                        y: event.clientY - reactFlowBounds.top,
                      });
                      const newNode: ProcesLogicStepItemType = {
                        id: uniqid(),
                        type: "default",
                        position,
                        data: {
                          type,
                          label:
                            {
                              get_objects: "Get objects",
                              create_objects: "Create objects",
                              update_objects: "Update objects",
                              assign_values: "Assign values",
                              conditions: "Conditions",
                            }[type] || "Unknown type",
                        },
                      };

                      setNewObject({
                        ...newObject,
                        logic: newObject.logic.concat(newNode),
                      });
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
            </context.UI.Design.Card>
            <Popover
              id="right-click-menu"
              open={Boolean(selectedElementOnCanvas)}
              anchorEl={selectedElementOnCanvas}
              onClose={() => setSelectedElementOnCanvas(null)}
              anchorOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <List disablePadding>
                <ListSubheader>{selectedNode?.data.label}</ListSubheader>
                <ListItem
                  button
                  onClick={() => {
                    context.canvas.interact.dialog({
                      display: true,
                      title: `Edit ${selectedNode?.data.label}`,
                      size: "md",
                      fields: {
                        args: {
                          label: "Args",
                          type: "custom",
                          value: selectedNode?.data.args || {},
                          component:
                            {
                              get_objects: FourOhFour,
                              create_objects: FourOhFour,
                              update_objects: FourOhFour,
                              assign_values: EditAssignValuesNode,
                              conditions: FourOhFour,
                            }[selectedNode?.data.type as string] || FourOhFour,
                          componentProps: { process: newObject },
                        },
                      },
                      actions: [
                        {
                          label: "Save",
                          onClick: (form, close) => {
                            console.log(form);
                            close();
                          },
                        },
                      ],
                    });
                    setSelectedNode(null);
                    setSelectedElementOnCanvas(null);
                  }}
                >
                  <ListItemIcon style={{ minWidth: 16, paddingRight: 5 }}>
                    <Icon icon="edit" size={16} />
                  </ListItemIcon>
                  <ListItemText>Edit node</ListItemText>
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    setSelectedNode(null);
                    setSelectedElementOnCanvas(null);
                    setNewObject({
                      ...newObject,
                      //@ts-ignore
                      logic: removeElements([selectedNode], newObject.logic),
                    });
                  }}
                >
                  <ListItemIcon style={{ minWidth: 16, paddingRight: 5 }}>
                    <Icon icon="trash" size={16} />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </ListItem>
              </List>
            </Popover>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={3}>
          {!isEqual(newObject, item.object) && (
            <context.UI.Design.Animation.Item key="save">
              <Button
                variant="outlined"
                style={{ color: "white", border: "1px solid white" }}
                fullWidth
                onClick={() =>
                  context.data.objects.update(newObject._id, newObject).then(
                    () =>
                      context.canvas.interact.snackbar("Updated", "success"),
                    (reason) =>
                      context.canvas.interact.snackbar(reason, "error")
                  )
                }
              >
                Save
              </Button>
            </context.UI.Design.Animation.Item>
          )}
          <context.UI.Design.Animation.Item key="process-variables">
            <context.UI.Design.Card title="Variables" withoutPadding>
              <ProcessVariables
                context={context}
                value={newObject.variables}
                onChange={(variables) =>
                  setNewObject({ ...newObject, variables })
                }
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
          <context.UI.Design.Animation.Item key="process-components">
            <context.UI.Design.Card title="Components" withoutPadding>
              <ProcessComponents context={context} />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
          <context.UI.Design.Animation.Item key="process-triggers">
            <context.UI.Design.Card title="Triggers" withoutPadding>
              Toolbox
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
      </Grid>
    </context.UI.Design.Animation.Container>
  );
};

export default ProcessDetail;
