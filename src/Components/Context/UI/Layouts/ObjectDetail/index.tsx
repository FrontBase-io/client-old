import { Button, ButtonGroup, Grid, Typography } from "@mui/material";
import { filter, map } from "lodash";
import isEqual from "lodash/isEqual";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { AppContext } from "../../..";
import {
  ModelLayoutType,
  ModelType,
  ObjectType,
  PreObjectType,
  ProcessObjectType,
} from "../../../../../Utils/Types";
import LayoutComponent from "./LayoutComponent";
import Actions from "../../../../Actions";
import DisplayImage from "../../Data/FieldDisplay/Image";
import { serverUrl } from "../../../../../Utils/Socket";

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
  withInlineSaveButton?: true;
  onSave?: () => void;
  style?: CSSProperties;
  defaults?: { [key: string]: any };
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
  withInlineSaveButton,
  onSave,
  style,
  defaults,
}) => {
  // Vars
  const [appliedObject, setAppliedObject] = useState<PreObjectType>({});
  const [newObject, setNewObject] = useState<PreObjectType>({});
  const [appliedModel, setAppliedModel] = useState<ModelType>();
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [selectedField, setSelectedField] = useState<string>();
  const [layout, setLayout] = useState<ModelLayoutType>();
  const [availableProcesses, setAvailableProcesses] = useState<{
    [key: string]: ProcessObjectType;
  }>({});

  const save = useCallback(() => {
    const fieldsToUpdate: { [key: string]: any } = defaults || {};
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
        (result) => {
          setViewMode("view");
          onSave && onSave();
        },
        (reason) => {
          context.canvas.interact.snackbar(
            typeof reason !== "string" ? JSON.stringify(reason) : reason,
            "error"
          );
          onSave && onSave();
        }
      );
    } else {
      // Create
      context.data.objects.create(appliedModel!.key, fieldsToUpdate).then(
        (result) => {
          setViewMode("view");
          onSave && onSave();
        },
        (reason) => {
          context.canvas.interact.snackbar(reason, "error");
          onSave && onSave();
        }
      );
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
  useEffect(() => {
    if (appliedModel) {
      let newLayout: ModelLayoutType;

      // eslint-disable-next-line array-callback-return
      (layoutKey || ["default"]).map((lk) => {
        if (appliedModel.layouts[lk] && !newLayout) {
          newLayout = appliedModel.layouts[lk];
        }
      });
      //@ts-ignore
      setLayout(newLayout || appliedModel.layouts["default"]);

      // Fetch the relevant processes
      const processesToFetch: string[] = [];
      //@ts-ignore
      filter(newLayout.buttons, (o) => o.match("process_")).map((b) =>
        processesToFetch.push((b as string).replace("process_", ""))
      );
      context.data.objects.get(
        "process",
        { _id: { $in: processesToFetch } },
        (fetchedProcesses) => {
          const newProcesses: { [key: string]: ProcessObjectType } = {};
          // eslint-disable-next-line array-callback-return
          fetchedProcesses?.map((fp) => {
            newProcesses[fp._id] = fp as ProcessObjectType;
          });
          setAvailableProcesses(newProcesses);
        }
      );
    }
  }, [appliedModel, context.data.objects, layoutKey]);
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
      if (viewMode === "view") {
        context.canvas.navbar.actions.add("edit", {
          label: "Edit",
          icon: "edit",
          onClick: () => setViewMode("edit"),
        });
      } else {
        context.canvas.navbar.actions.remove("edit");
      }
    } else {
      context.canvas.navbar.actions.add("update", {
        label: "Update",
        icon: "save",
        onClick: save,
      });
    }

    return () => context.canvas.navbar.actions.remove("update");
  }, [appliedObject, context.canvas.navbar.actions, newObject, save, viewMode]);
  useEffect(() => {
    appliedObject._id ? setViewMode("view") : setViewMode("edit");
  }, [appliedObject]);
  useEffect(() => {
    if (layout?.factsbar?.color) {
      //@ts-ignore
      context.utils.setPrimaryColor(appliedObject[layout.factsbar.color]);
    }

    return () => {
      //@ts-ignore
      context.utils.setPrimaryColor(context.appData.color);
    };
  }, [appliedObject, context.appData.color, context.utils, layout]);
  // UI
  if (
    !appliedModel ||
    (!appliedObject && appliedObject !== null) ||
    (!newObject && newObject !== null)
  )
    return <context.UI.Loading />;

  if (!layout)
    return (
      <context.UI.Design.Animation.Animate>
        Layout {layoutKey || "default"} not found.
      </context.UI.Design.Animation.Animate>
    );

  return (
    <div
      style={{
        height: "100%",
        paddingBottom: 100,
        ...style,
      }}
      className="scrollIndependently"
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
                if (button.match("process_")) {
                  const process =
                    availableProcesses[button.replace("process_", "")];
                  return (
                    <Button
                      style={{ color: "white" }}
                      onClick={() => {
                        context.data.actions.executeSingleAction(
                          process._id,
                          appliedObject as ObjectType
                        );
                      }}
                    >
                      {process?.name || "One sec..."}
                    </Button>
                  );
                } else {
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
                }
              })}
            </ButtonGroup>
          </div>
        </div>
      )}
      {layout.factsbar && (layout.factsbar.fields || []).length > 0 && (
        <Grid container>
          {layout.factsbar.image && (
            <Grid item xs={1}>
              <DisplayImage
                alt={appliedModel.fields[layout.factsbar.image].label}
                src={serverUrl + appliedObject[layout.factsbar.image]}
                style={{ position: "relative", top: 25, left: 10 }}
              />
            </Grid>
          )}
          <Grid item xs={layout.factsbar.image ? 11 : 12}>
            <context.UI.Design.Card
              title={
                layout.factsbar.title && appliedObject[layout.factsbar.title]
              }
            >
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                {layout.factsbar.fields?.map((f) => (
                  <Grid
                    item
                    //@ts-ignore
                    xs={12 / layout.factsbar.fields?.length || 1}
                    key={`facts-${f}`}
                  >
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
          </Grid>
        </Grid>
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
      {withInlineSaveButton && (
        <Button fullWidth variant="outlined" onClick={save}>
          Save
        </Button>
      )}
    </div>
  );
};

export default ObjectDetail;
