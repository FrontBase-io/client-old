import { Button, ButtonGroup, Grid } from "@mui/material";
import { map } from "lodash";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useState } from "react";
import { AppContext } from "../../..";
import {
  ModelLayoutType,
  ModelType,
  ObjectType,
  PreObjectType,
} from "../../../../../Utils/Types";
import LayoutComponent from "./LayoutComponent";
import Actions from "../../../../Actions";

const ObjectDetail: React.FC<{
  context: AppContext;
  modelKey: string;
  objectId?: string;
  object?: ObjectType;
  model?: ModelType;
  baseUrl?: string;
  layoutKey?: string[];
  onChange?: (newObject: PreObjectType) => void;
  onAfterButtonPress?: { [key: string]: () => void };
}> = ({
  objectId,
  modelKey,
  baseUrl,
  context,
  layoutKey,
  model,
  object,
  onChange,
  onAfterButtonPress,
}) => {
  // Vars
  const [appliedObject, setAppliedObject] = useState<PreObjectType>({});
  const [newObject, setNewObject] = useState<PreObjectType>({});
  const [appliedModel, setAppliedModel] = useState<ModelType>();
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [selectedField, setSelectedField] = useState<string>();
  const save = useCallback(() => {
    const fieldsToUpdate: { [key: string]: any } = {};
    map(newObject, (value, key) => {
      if (
        JSON.stringify(appliedObject![key]) !== JSON.stringify(newObject![key])
      ) {
        fieldsToUpdate[key] = newObject![key];
      }
    });

    if (appliedObject._id) {
      // Update
      context.data.objects.update(appliedObject!._id, fieldsToUpdate).then(
        (result) => setViewMode("view"),
        (reason) => context.canvas.interact.snackbar(reason, "error")
      );
    } else {
      // Create
    }
  }, [appliedObject, context.canvas.interact, context.data.objects, newObject]);

  // Lifecycle
  // Pick model
  useEffect(
    () =>
      model
        ? setAppliedModel(model)
        : context.data.models.get(modelKey, (fetchedModel) =>
            setAppliedModel(fetchedModel)
          ),
    [context.data.models, model, modelKey]
  );
  // Pick Object
  useEffect(() => {
    if (object) {
      setAppliedObject(object);
    } else if (objectId) {
      context.data.objects.get(
        // Fetch object based on ID
        modelKey,
        { _id: objectId },
        (fetchedObjects) => {
          setAppliedObject(fetchedObjects[0]);
          setNewObject(fetchedObjects[0]);
        }
      );
    }
  }, [
    context.data.models,
    context.data.objects,
    model,
    modelKey,
    object,
    objectId,
  ]);
  useEffect(() => {
    if (appliedModel && appliedObject) {
      context.canvas.navbar.name(appliedObject[appliedModel.primary]);
      if (baseUrl) context.canvas.navbar.up(baseUrl);

      return () => {
        context.canvas.navbar.name(undefined);
        context.canvas.navbar.up(undefined);
      };
    }
  }, [
    appliedModel,
    appliedObject,
    baseUrl,
    context.canvas.navbar,
    context.canvas.navbar.name,
    context.canvas.navbar.up,
    viewMode,
  ]);
  useEffect(() => {
    if (isEqual(appliedObject, newObject)) {
      context.canvas.navbar.actions.remove("update");
    } else {
      context.canvas.navbar.actions.add("update", {
        label: "update",
        icon: "save",
        onClick: save,
      });
    }

    return () => context.canvas.navbar.actions.remove("update");
  }, [appliedObject, context.canvas.navbar.actions, newObject, save]);
  useEffect(() => {
    appliedObject._id ? setViewMode("view") : setViewMode("edit");
  }, [appliedObject]);

  // UI
  if (
    !appliedModel ||
    (!appliedObject && appliedObject !== null) ||
    (!newObject && newObject !== null)
  )
    return <context.UI.Loading />;

  let layout: ModelLayoutType | undefined = undefined;
  if (layoutKey) {
    layoutKey.map((lk) => {
      if (appliedModel.layouts[lk] && !layout) {
        layout = appliedModel.layouts[lk];
      }
    });
  }
  if (!layout) layout = appliedModel.layouts["default"];

  if (!layout)
    return (
      <context.UI.Design.Animation.Animate>
        Layout {layoutKey || "default"} not found.
      </context.UI.Design.Animation.Animate>
    );

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
          setNewObject(appliedObject);
        }
      }}
    >
      {layout.buttons && (
        <div style={{ height: 35, marginRight: 15 }}>
          <div style={{ float: "right" }}>
            <ButtonGroup
              variant="outlined"
              color="primary"
              style={{ marginBottom: 5, border: "1px solid white" }}
            >
              {layout.buttons.slice(0, 3).map((button) => {
                const action = Actions[button];
                return (
                  <Button
                    key={button}
                    onClick={() =>
                      action
                        .onClick(
                          context,
                          appliedObject as ObjectType,
                          appliedModel
                        )
                        .then(
                          () =>
                            onAfterButtonPress &&
                            onAfterButtonPress[button] &&
                            onAfterButtonPress[button]()
                        )
                    }
                    style={{ color: "white" }}
                  >
                    {button}
                  </Button>
                );
              })}
            </ButtonGroup>
          </div>
        </div>
      )}
      {layout.factsbar && (
        <context.UI.Design.Card>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {layout.factsbar.map((f) => (
              <Grid item xs={2} key={`facts-${f}`}>
                <context.UI.Data.FieldDisplay
                  context={context}
                  model={appliedModel}
                  object={appliedObject as ObjectType}
                  fieldKey={f}
                />
              </Grid>
            ))}
          </Grid>
        </context.UI.Design.Card>
      )}
      {layout.layout.map((layoutItem, layoutItemIndex) => (
        <LayoutComponent
          layoutItem={layoutItem}
          context={context}
          key={`layoutItem-${layoutItemIndex}`}
          model={appliedModel}
          object={appliedObject as ObjectType}
          newObject={newObject as ObjectType}
          updateField={(key, value) => {
            onChange && onChange({ ...(newObject || {}), [key]: value });
            setNewObject({ ...(newObject || {}), [key]: value });
          }}
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
