import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, { useState, useEffect } from "react";
import { AppContext } from "../../../../Components/Context";
import TextInput from "../../../../Components/Inputs/Text";
import {
  ListItemType,
  ModelFieldType,
  ModelType,
  ResponseType,
} from "../../../../Utils/Types";

const ModelFieldDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
  model: ModelType;
}> = ({ context, selectedKey, item, model }) => {
  // Vars
  const [field, setField] = useState<ModelFieldType>({ label: "" });
  const [models, setModels] = useState<ModelType[]>([]);

  // Lifecycle
  useEffect(() => {
    context.data.models.getAll((models) => setModels(models));
  }, []);
  useEffect(() => {
    setField(item.object);
  }, [selectedKey]);

  // UI
  return (
    <context.UI.Design.Animation.Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <context.UI.Design.Animation.Item key="Field">
            <context.UI.Design.Card title="Field">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextInput
                    label="Label"
                    value={field?.label || ""}
                    onChange={(label) => setField({ ...field, label })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Key:</Typography>{" "}
                  <small>{item.key}</small>
                </Grid>
              </Grid>
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={12}>
          <context.UI.Design.Animation.Item key="Data">
            <context.UI.Design.Card title="Data">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <context.UI.Inputs.Select
                    label="Type"
                    value={field?.type || ""}
                    onChange={(type) =>
                      setField({
                        ...field,
                        // @ts-ignore
                        type,
                      })
                    }
                    options={[
                      { label: "Text", value: "text" },
                      { label: "Number", value: "number" },
                      { label: "Relationship", value: "relationship" },
                    ]}
                  />
                </Grid>
                {field.type === "relationship" && (
                  <>
                    <Grid item xs={6}>
                      <context.UI.Inputs.Select
                        label="Relationship to"
                        value={field.relationshipTo || ""}
                        options={context.utils.listifyForSelect(
                          models,
                          "label",
                          "key"
                        )}
                        onChange={(relationshipTo) =>
                          setField({
                            ...field,
                            relationshipTo: relationshipTo as string,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        Filter relationship
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={6}>
          <context.UI.Design.Animation.Item key="Validations">
            <context.UI.Design.Card title="Validations">
              <context.UI.Inputs.Boolean
                label="Required"
                value={field?.required}
                fullWidth
                onChange={(required) => setField({ ...field, required })}
              />
              <context.UI.Inputs.Boolean
                label="Unique"
                value={field?.unique}
                fullWidth
                onChange={(unique) => setField({ ...field, unique })}
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={6}>
          <context.UI.Design.Animation.Item key="Transformations">
            <context.UI.Design.Card title="Transformations">
              Test
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={12}>
          <context.UI.Design.Animation.Item key="Security">
            <context.UI.Design.Card title="Security"></context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={12} style={{ padding: 15 }}>
          <context.UI.Design.Animation.Item key="Save">
            <Button
              fullWidth
              disabled={JSON.stringify(field) === JSON.stringify(item.object)}
              variant="contained"
              color="primary"
              onClick={() => {
                const newModel = {
                  ...model,
                  fields: { ...model.fields, [selectedKey]: field },
                };
                context.data.models.update(newModel);
              }}
            >
              Save
            </Button>
          </context.UI.Design.Animation.Item>
        </Grid>
      </Grid>
    </context.UI.Design.Animation.Container>
  );
};

export default ModelFieldDetail;
