import { ListSubheader } from "@material-ui/core";
import List from "@material-ui/core/List";
import React from "react";
import { AppContext } from "../../../../Components/Context";
import { ModelType } from "../../../../Utils/Types";
import DragItem from "./DragItem";

const ModelLayoutComponents: React.FC<{
  context: AppContext;
  model: ModelType;
}> = ({
  context: {
    UI: {
      Design: { Animation },
    },
  },
  model,
}) => {
  return (
    <List>
      <Animation.Container>
        <Animation.Item key="component-seperator-animation">
          <ListSubheader>Animation</ListSubheader>
        </Animation.Item>
        <Animation.Item key="component-animationcontainer">
          <DragItem
            layoutItem={{ label: "Animation", type: "Animation" }}
            icon="angle-up"
            label="Animate"
          />
        </Animation.Item>
        <Animation.Item key="component-GridItem">
          <DragItem
            layoutItem={{
              label: "Animation Container",
              type: "AnimationContainer",
            }}
            icon="angle-double-up"
            label="Animation Container"
          />
        </Animation.Item>
        <Animation.Item key="component-GridItem">
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
      </Animation.Container>
    </List>
  );
};

export default ModelLayoutComponents;
