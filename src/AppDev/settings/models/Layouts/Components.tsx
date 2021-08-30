import { ListSubheader } from "@material-ui/core";
import List from "@material-ui/core/List";
import React from "react";
import { AppContext } from "../../../../Components/Context";
import { LayoutItemType, ModelType } from "../../../../Utils/Types";
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
        <Animation.Item key="component-seperator-grid">
          <ListSubheader>Grid</ListSubheader>
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
      </Animation.Container>
    </List>
  );
};

export default ModelLayoutComponents;
