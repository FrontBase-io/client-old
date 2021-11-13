import { Grid } from "@mui/material";
import { useRef, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import ActionComponents from "./Components";
import ReactFlow, {
  Controls,
  MiniMap,
  removeElements,
  addEdge,
  ReactFlowProvider,
  Node,
} from "react-flow-renderer";
import { cloneDeep } from "lodash";
import { ProcesLogicStepItemType } from "../../../../Utils/Types";
import uniqid from "uniqid";
import { findIndex } from "lodash";

const ActionDesigner: React.FC<{
  context: AppContext;
  value: [];
  onChange: (newVal: any[]) => void;
}> = ({ context, value, onChange }) => {
  // Vars
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElementOnCanvas, setSelectedElementOnCanvas] =
    useState<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>();

  // Lifecycle

  // UI

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={9}>
        <ReactFlowProvider>
          <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
            <ReactFlow
              elements={value}
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
                value[findIndex(newValue, (o) => o.id === node.id)] = node;
                onChange(newValue);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => {
                console.log("droppeth");
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
      </Grid>
      <Grid item xs={12} md={3}>
        <ActionComponents />
      </Grid>
    </Grid>
  );
};

export default ActionDesigner;
