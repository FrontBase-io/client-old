import { List, ListItem } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { AppContext } from "../../../../Components/Context";
import { LayoutItemType, ModelType } from "../../../../Utils/Types";
import DragItem from "./DragItem";

const ModelLayoutFields: React.FC<{
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
        {map(model.fields, (field, key) => {
          const map: { [key: string]: string } = {
            text: "font",
            number: "sort-numeric-down",
            relationship: "bezier-curve",
            formula: "flask",
            options: "list",
            error: "exclamation-triangle",
          };
          const icon: string = map[field.type || "error"];
          return (
            <Animation.Item key={key}>
              <DragItem
                layoutItem={{
                  label: field.label,
                  type: "Field",
                  args: { field: key },
                }}
                icon={icon}
                label={field.label}
              />
            </Animation.Item>
          );
        })}
      </Animation.Container>
    </List>
  );
};

export default ModelLayoutFields;
