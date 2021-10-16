import { Button, Grid } from "@mui/material";
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
} from "react-flow-renderer";
import { useEffect, useRef, useState } from "react";
import { isEqual } from "lodash";
import ProcessVariables from "./Variables";
import ProcessComponents from "./Components";
import uniqid from "uniqid";

const ProcessDetail: React.FC<ListDetailType> = ({ context, item }) => {
  // Vars
  const [newObject, setNewObject] = useState<ProcessObjectType>();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

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
                        logic: addEdge(params, newObject.logic),
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
                      console.log(event);

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
                        type,
                        position,
                        data: { label: `New ${type}` },
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
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={3}>
          {!isEqual(newObject, item.object) && (
            <context.UI.Design.Animation.Item key="save">
              <Button
                variant="outlined"
                style={{ color: "white", border: "1px solid white" }}
                fullWidth
                onClick={() => console.log(newObject.logic)}
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
