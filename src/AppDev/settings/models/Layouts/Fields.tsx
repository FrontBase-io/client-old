import { List } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { AppContext } from "../../../../Components/Context";
import { ModelType } from "../../../../Utils/Types";
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
    <List style={{ padding: 0 }}>
      <Animation.Container>
        {map(model.fields, (field, key) => {
          const map: { [key: string]: string } = {
            text: "font",
            number: "sort-numeric-down",
            relationship: "link",
            relationship_m: "network-wired",
            formula: "flask",
            options: "list",
            date: "calendar-alt",
            color: "palette",
            image: "image",
            file: "paperclip",
            boolean: "check-square",
            "free-data": "table",
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
