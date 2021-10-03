import { Grid } from "@mui/material";
import { map } from "lodash";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useState } from "react";
import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";
import LayoutComponent from "./LayoutComponent";
import styles from "./styles.module.scss";

const ObjectDetail: React.FC<{
  context: AppContext;
  modelKey: string;
  objectId: string;
  baseUrl: string;
  layoutKey?: string;
}> = ({ objectId, modelKey, baseUrl, context, layoutKey }) => {
  // Vars
  const [object, setObject] = useState<ObjectType>();
  const [newObject, setNewObject] = useState<ObjectType>();
  const [model, setModel] = useState<ModelType>();
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [selectedField, setSelectedField] = useState<string>();
  const save = useCallback(() => {
    const fieldsToUpdate: { [key: string]: any } = {};
    map(newObject, (value, key) => {
      if (JSON.stringify(object![key]) !== JSON.stringify(newObject![key])) {
        fieldsToUpdate[key] = newObject![key];
      }
    });

    context.data.objects.update(object!._id, fieldsToUpdate).then(
      (result) => setViewMode("view"),
      (reason) => context.canvas.interact.snackbar(reason, "error")
    );
  }, [context.canvas.interact, context.data.objects, newObject, object]);

  // Lifecycle
  useEffect(() => {
    context.data.objects.get(modelKey, { _id: objectId }, (objects) => {
      setObject(objects[0]);
      setNewObject(objects[0]);
      context.data.models.get(objects[0].meta.model, (model) => {
        setModel(model);
        context.canvas.navbar.name.set(objects[0][model.primary]);
        context.canvas.navbar.up.set(baseUrl);
      });
    });

    return () => {
      context.canvas.navbar.name.set(undefined);
      context.canvas.navbar.up.set(undefined);
    };
  }, [
    objectId,
    modelKey,
    context.data.objects,
    context.data.models,
    context.canvas.navbar.name,
    context.canvas.navbar.up,
    baseUrl,
  ]);
  useEffect(() => {
    if (isEqual(object, newObject)) {
      context.canvas.navbar.actions.remove("update");
    } else {
      context.canvas.navbar.actions.add("update", {
        label: "update",
        icon: "save",
        onClick: save,
      });
    }

    return () => context.canvas.navbar.actions.remove("update");
  }, [
    object,
    newObject,
    context.canvas.navbar.name,
    context.canvas.navbar.actions,
    context.data.objects,
    context.canvas.interact,
    save,
  ]);

  // UI
  if (!model || !object || !newObject) return <context.UI.Loading />;
  if (!(model.layouts || {})[layoutKey || "default"])
    return (
      <context.UI.Design.Animation.Animate>
        Layout {layoutKey || "default"} not found.
      </context.UI.Design.Animation.Animate>
    );
  const layout = model.layouts[layoutKey || "default"];

  return (
    <div
      style={{ height: "100%" }}
      onKeyDown={(event) => {
        if (
          viewMode === "edit" &&
          event.ctrlKey &&
          String.fromCharCode(event.which).toLowerCase() === "s"
        ) {
          event.preventDefault();
          save();
        } else if (event.which === 27) {
          setViewMode("view");
          setNewObject(object);
        }
      }}
    >
      {layout.factsbar && (
        <context.UI.Design.Card>
          {layout.factsbar.fields && (
            <Grid container>
              {layout.factsbar.fields.map((f) => (
                <Grid
                  item
                  //@ts-ignore
                  xs={12 / (layout.factsbar?.fields || []).length || 12}
                  key={`facts-${f}`}
                >
                  <context.UI.Data.FieldDisplay
                    modelField={model.fields[f]}
                    objectField={object[f]}
                    fieldKey={f}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </context.UI.Design.Card>
      )}
      {layout.layout.map((layoutItem, layoutItemIndex) => (
        <LayoutComponent
          layoutItem={layoutItem}
          context={context}
          key={`layoutItem-${layoutItemIndex}`}
          model={model}
          object={object}
          newObject={newObject}
          updateField={(key, value) =>
            setNewObject({ ...newObject, [key]: value })
          }
          viewMode={viewMode}
          selectedField={selectedField}
          selectField={(fieldName) => {
            setSelectedField(fieldName);
            setViewMode("edit");
          }}
        />
      ))}
    </div>
  );
};

export default ObjectDetail;
