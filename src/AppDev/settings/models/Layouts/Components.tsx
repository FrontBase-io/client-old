import { ListSubheader } from "@mui/material";
import List from "@mui/material/List";
import { filter, map } from "lodash";
import React, { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { ModelFieldType, ModelType } from "../../../../Utils/Types";
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
  // Vars
  const [formulas, setFormulas] = useState<ModelFieldType[]>([]);

  // Lifecycle
  useEffect(() => {
    setFormulas(filter(model.fields, (o) => o.type === "relationship"));
  }, [model]);

  // UI
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
        {formulas.length > 0 && (
          <>
            <Animation.Item key="Relationships">
              <ListSubheader>Relationships</ListSubheader>
            </Animation.Item>
            {map(
              model.fields,
              (field, key) =>
                field.type === "relationship" && (
                  <Animation.Item key={`component-RelatedItem-${key}`}>
                    <DragItem
                      layoutItem={{
                        label: field.label,
                        type: "RelatedItem",
                        args: { field: key },
                      }}
                      icon="address-card"
                      label={`Related item: ${field.label}`}
                    />
                  </Animation.Item>
                )
            )}
          </>
        )}
      </Animation.Container>
    </List>
  );
};

export default ModelLayoutComponents;
