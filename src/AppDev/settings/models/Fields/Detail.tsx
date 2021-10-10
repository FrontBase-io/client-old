import {
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import React, { useState, useEffect } from "react";
import { AppContext } from "../../../../Components/Context";
import SelectInput from "../../../../Components/Inputs/Select";
import TextInput from "../../../../Components/Inputs/Text";
import FormulaDesigner from "../../../../Components/System/FormulaDesigner";
import {
  ListItemType,
  ModelFieldType,
  ModelType,
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
  }, [context.data.models]);
  useEffect(() => {
    setField(item.object);
  }, [item.object, selectedKey]);

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
                      { label: "Options", value: "options" },
                      { label: "Relationship", value: "relationship" },
                      { label: "Relationship (many)", value: "relationship_m" },
                      { label: "Date", value: "date" },
                      { label: "Formula", value: "formula" },
                    ]}
                  />
                </Grid>
                {field.type === "relationship" ||
                  (field.type === "relationship_m" && (
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
                  ))}
                {field.type === "formula" && (
                  <FormulaDesigner
                    context={context}
                    startModel={model.key}
                    value={field.formula || ""}
                    onChange={(formula) => setField({ ...field, formula })}
                    outputType={field.formulaOutputType || "text"}
                    onChangeOutputType={(formulaOutputType) =>
                      setField({ ...field, formulaOutputType })
                    }
                  />
                )}
                {field.type === "text" && (
                  <Grid item xs={12}>
                    <context.UI.Inputs.Select
                      label="Input type"
                      value={field?.displayType || "textfield"}
                      options={[
                        { label: "Textfield", value: "textfield" },
                        { label: "Textarea", value: "textarea" },
                        { label: "Rich text", value: "html" },
                        { label: "Markdown", value: "markdown" },
                      ]}
                      onChange={(displayType) =>
                        setField({
                          ...field,
                          displayType: displayType as string,
                        })
                      }
                    />
                  </Grid>
                )}
                {field.type === "date" && (
                  <Grid item xs={12}>
                    <SelectInput
                      label="Variant"
                      value={field.variant || "date"}
                      options={[
                        { label: "Date", value: "date" },
                        { label: "Time", value: "time" },
                        { label: "Date / time", value: "datetime" },
                      ]}
                      onChange={(variant) =>
                        //@ts-ignore
                        setField({ ...field, variant })
                      }
                    />
                  </Grid>
                )}
                {field.type === "options" && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="h6">Input options</Typography>
                      <context.UI.Inputs.Select
                        label="Display as"
                        value={field.optionsDisplayAs as string}
                        onChange={(optionsDisplayAs) =>
                          setField({
                            ...field,
                            optionsDisplayAs: optionsDisplayAs as string,
                          })
                        }
                        options={[
                          { label: "Dropdown", value: "dropdown" },
                          { label: "List", value: "list" },
                        ]}
                      />
                      <context.UI.Inputs.Boolean
                        label="Select multiple"
                        value={field.selectMultiple}
                        onChange={(selectMultiple) =>
                          setField({ ...field, selectMultiple })
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">Options</Typography>
                      <List>
                        {(field.options || []).map((option, optionIndex) => (
                          <ListItem
                            key={option.value}
                            button
                            onClick={() =>
                              context.canvas.interact.dialog({
                                display: true,
                                title: "Add option",
                                fields: {
                                  label: {
                                    label: "Label",
                                    value: option.label,
                                  },
                                  value: {
                                    label: "Value",
                                    type: "key",
                                    value: option.value,
                                  },
                                },
                                actions: [
                                  {
                                    label: "Add",
                                    onClick: (form, close) => {
                                      let newOptions = field.options || [];
                                      newOptions[optionIndex] = {
                                        value: form.value,
                                        label: form.label,
                                      };
                                      setField({
                                        ...field,
                                        options: newOptions,
                                      });
                                      close();
                                    },
                                  },
                                ],
                              })
                            }
                          >
                            <ListItemText>{option.label}</ListItemText>
                          </ListItem>
                        ))}
                        <Divider />
                        <ListItem
                          button
                          onClick={() =>
                            context.canvas.interact.dialog({
                              display: true,
                              title: "Add option",
                              fields: {
                                label: {
                                  label: "Label",
                                  linkToKeyField: "value",
                                },
                                value: { label: "Value", type: "key" },
                              },
                              actions: [
                                {
                                  label: "Add",
                                  onClick: (form, close) => {
                                    setField({
                                      ...field,
                                      options: [
                                        ...(field.options || []),
                                        {
                                          label: form.label,
                                          value: form.value,
                                        },
                                      ],
                                    });
                                    close();
                                  },
                                },
                              ],
                            })
                          }
                        >
                          Add
                        </ListItem>
                      </List>
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
                disabled={field.type === "formula"}
              />
              <context.UI.Inputs.Boolean
                label="Unique"
                value={field?.unique}
                fullWidth
                onChange={(unique) => setField({ ...field, unique })}
                disabled={field.type === "formula"}
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
