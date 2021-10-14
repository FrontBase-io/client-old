import { Button, Grid } from "@mui/material";
import { ListDetailType, ProcessObjectType } from "../../../Utils/Types";
import ReactFlow, {
  Controls,
  MiniMap,
  removeElements,
  addEdge,
} from "react-flow-renderer";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";
import ProcessVariables from "./Variables";

const ProcessDetail: React.FC<ListDetailType> = ({ context, item }) => {
  // Vars
  const [newObject, setNewObject] = useState<ProcessObjectType>();

  // Lifecycle
  useEffect(() => {
    setNewObject(item.object);
  }, [item]);

  // UI
  if (!newObject) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Container>
      <Grid container>
        <Grid item xs={9}>
          <context.UI.Design.Animation.Item key="process-canvas">
            <context.UI.Design.Card
              title="Process"
              style={{ height: "calc(100vh - 150px)" }}
              withoutPadding
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
                    logic: removeElements(elementsToRemove, newObject.logic),
                  })
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
            <context.UI.Design.Card title="Components">
              Toolbox
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
          <context.UI.Design.Animation.Item key="process-triggers">
            <context.UI.Design.Card title="Triggers">
              Toolbox
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
      </Grid>
    </context.UI.Design.Animation.Container>
  );
};

export default ProcessDetail;
