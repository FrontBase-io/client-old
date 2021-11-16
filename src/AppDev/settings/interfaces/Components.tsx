import { List, ListSubheader } from "@mui/material";
import { AppContext } from "../../../Components/Context";
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
    <List disablePadding dense>
      <Animation.Container>
        <Animation.Item key="component-seperator-Layout">
          <ListSubheader>Animation</ListSubheader>
        </Animation.Item>
        <Animation.Item key="component-animationcontainer">
          <DragItem
            layoutItem={{ label: "Animation", type: "Animation" }}
            icon="angle-up"
            label="Animate"
            description="Quick animation"
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
            description="Use for staggered animations"
          />
        </Animation.Item>
        <Animation.Item key="component-AnimationItem">
          <DragItem
            layoutItem={{ label: "Animation Item", type: "AnimationItem" }}
            icon="angle-up"
            label="Animation Item"
            description="Use for staggered animations"
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
            description="A grid of layout blocks."
          />
        </Animation.Item>
        <Animation.Item key="component-GridItem">
          <DragItem
            layoutItem={{ label: "Grid Item", type: "GridItem" }}
            icon="th-large"
            label="Grid Item"
            description="Responsively lays out content."
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
            description="Shows a list and the corresponding detail page."
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
            description="Used for grouping content in a layout."
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
            description="Lists data"
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
            description="Renders a model's layout."
          />
        </Animation.Item>
        <Animation.Item key="component-DisplayText">
          <DragItem
            layoutItem={{ label: "Display Text", type: "DisplayText" }}
            icon="align-left"
            label="Display Text"
            description="Displays formatted text (with formulas)"
          />
        </Animation.Item>
        <Animation.Item key="Inputs">
          <ListSubheader>Inputs</ListSubheader>
        </Animation.Item>
        <Animation.Item key="component-InputText">
          <DragItem
            layoutItem={{ label: "Text", type: "InputText" }}
            icon="font"
            label="Text"
          />
        </Animation.Item>
        <Animation.Item key="component-InputBoolean">
          <DragItem
            layoutItem={{ label: "Checkbox", type: "InputBoolean" }}
            icon="check-square"
            label="Checkbox"
          />
        </Animation.Item>
      </Animation.Container>
    </List>
  );
};

export default InterfaceComponents;
