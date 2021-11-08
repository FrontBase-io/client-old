import { List, ListSubheader } from "@mui/material";
import { AppContext } from "../../../Components/Context";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
} from "../../../Utils/Types";
import DragItem from "./DragItem";

const InterfaceComponents: React.FC<{
  context: AppContext;
}> = ({
  context: {
    UI: {
      Design: { Animation },
    },
  },
}) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <List disablePadding>
      <Animation.Container>
        <Animation.Item key="component-seperator-Layout">
          <ListSubheader>Animation</ListSubheader>
        </Animation.Item>
        <Animation.Item key="component-animationcontainer">
          <DragItem
            layoutItem={{ label: "Animation", type: "Animation" }}
            icon="angle-up"
            label="Animate"
          />
        </Animation.Item>
        <Animation.Item key="component-AnimationContainer">
          <DragItem
            layoutItem={{
              label: "Animation Container",
              type: "AnimationContainer",
            }}
            icon="angle-double-up"
            label="Animation Container"
          />
        </Animation.Item>
        <Animation.Item key="component-AnimationItem">
          <DragItem
            layoutItem={{ label: "Animation Item", type: "AnimationItem" }}
            icon="angle-up"
            label="Animation Item"
          />
        </Animation.Item>
        <Animation.Item key="component-seperator-layout">
          <ListSubheader>Layout</ListSubheader>
        </Animation.Item>
        <Animation.Item key="component-GridContainer">
          <DragItem
            layoutItem={{ label: "Grid Container", type: "GridContainer" }}
            icon="border-none"
            label="Grid Container"
          />
        </Animation.Item>
        <Animation.Item key="component-GridItem">
          <DragItem
            layoutItem={{ label: "Grid Item", type: "GridItem" }}
            icon="th-large"
            label="Grid Item"
          />
        </Animation.Item>
        <Animation.Item key="component-ListDetailLayout">
          <DragItem
            layoutItem={{
              label: "List-Detail Layout",
              type: "ListDetailLayout",
            }}
            icon="th-list"
            label="List-Detail Layout"
          />
        </Animation.Item>
        <Animation.Item key="Design">
          <ListSubheader>Design</ListSubheader>
        </Animation.Item>
        <Animation.Item key="component-Card">
          <DragItem
            layoutItem={{ label: "Card", type: "Card" }}
            icon="border-style"
            label="Card"
          />
        </Animation.Item>
        <Animation.Item key="Components">
          <ListSubheader>Components</ListSubheader>
        </Animation.Item>
        <Animation.Item key="component-List">
          <DragItem
            layoutItem={{ label: "List", type: "List" }}
            icon="list-alt"
            label="List"
          />
        </Animation.Item>
        <Animation.Item key="Objects">
          <ListSubheader>Objects</ListSubheader>
        </Animation.Item>
        <Animation.Item key="component-ObjectLayout">
          <DragItem
            layoutItem={{ label: "Object Layout", type: "ObjectLayout" }}
            icon="object-group"
            label="Object Layout"
          />
        </Animation.Item>
      </Animation.Container>
    </List>
  );
};

export default InterfaceComponents;
