import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../..";
import { ModelType, SelectOptionType } from "../../../../Utils/Types";
import Icon from "../../../Design/Icon";

const ObjectDesigner: React.FC<{
  context: AppContext;
  withFormula?: true;
  model?: ModelType;
  modelKey?: string;
  value: { [key: string]: any };
  onChange: (value: {}) => void;
  mode?: "filter" | "create";
  title?: string;
}> = ({ model, modelKey, context, value, onChange, title, mode }) => {
  // Vars
  const [appliedModel, setAppliedModel] = useState<ModelType>();
  const [fieldOptions, setFieldOptions] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    model
      ? setAppliedModel(model)
      : context.data.models.get(modelKey!, (m) => setAppliedModel(m));
  }, [context.data.models, model, modelKey]);
  useEffect(() => {
    if (appliedModel) {
      const newOptions: SelectOptionType[] = [];
      map(appliedModel.fields, (v, k) => {
        if (!Object.keys(value).includes(k))
          newOptions.push({ label: v.label, value: k });
      });
      setFieldOptions(newOptions);
    }
  }, [appliedModel, context.utils, value]);

  // UI
  if (!appliedModel) return <context.UI.Loading />;
  return (
    <context.UI.Design.Card title={title}>
      <Table>
        {(!mode || mode === "filter") && (
          <TableHead>
            <TableRow>
              <TableCell>Field</TableCell>
              <TableCell>Operator</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {!mode || mode === "filter"
            ? map(value, (fieldValue, fieldKey) => {
                const field = appliedModel.fields[fieldKey];
                return (
                  <TableRow key={fieldKey}>
                    <TableCell>{field.label}</TableCell>
                    <TableCell>
                      <context.UI.Inputs.Select
                        label="Operator"
                        value={fieldValue.operator}
                        options={[{ label: "Is equal to", value: "equals" }]}
                        onChange={(newValue) =>
                          onChange({
                            ...value,
                            [fieldKey]: {
                              ...fieldValue,
                              value: { _form: newValue },
                            },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Grid container>
                        <Grid item xs={11}>
                          {fieldValue.value._form ? (
                            <context.UI.Inputs.Text
                              label={field.label}
                              value={fieldValue.value._form}
                              onChange={(newValue) =>
                                onChange({
                                  ...value,
                                  [fieldKey]: {
                                    ...fieldValue,
                                    value: { _form: newValue },
                                  },
                                })
                              }
                            />
                          ) : field.type === "text" ? (
                            <context.UI.Inputs.Text
                              label={field.label}
                              value={fieldValue}
                              onChange={(newValue) =>
                                onChange({
                                  ...value,
                                  [fieldKey]: {
                                    ...fieldValue,
                                    value: newValue,
                                  },
                                })
                              }
                            />
                          ) : (
                            `Unknown type ${field.type}`
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          {fieldValue.value._form ? (
                            <IconButton
                              onClick={() =>
                                onChange({
                                  ...value,
                                  [fieldKey]: {
                                    ...fieldValue,
                                    value: fieldValue.value._form,
                                  },
                                })
                              }
                            >
                              <Icon icon="keyboard" />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                onChange({
                                  ...value,
                                  [fieldKey]: {
                                    ...fieldValue,
                                    value: { _form: fieldValue.value },
                                  },
                                })
                              }
                            >
                              <Icon icon="vials" />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })
            : map(value, (fieldValue, fieldKey) => {
                const field = appliedModel.fields[fieldKey];
                return (
                  <TableRow key={fieldKey}>
                    <TableCell>
                      <Grid container>
                        <Grid item xs={11}>
                          {fieldValue._form ? (
                            <context.UI.Inputs.Text
                              label={field.label}
                              value={fieldValue._form}
                              onChange={(newValue) =>
                                onChange({
                                  ...value,
                                  [fieldKey]: { _form: newValue },
                                })
                              }
                            />
                          ) : field.type === "text" ? (
                            <context.UI.Inputs.Text
                              label={field.label}
                              value={fieldValue}
                              onChange={(newValue) =>
                                onChange({
                                  ...value,
                                  [fieldKey]: newValue,
                                })
                              }
                            />
                          ) : (
                            `Unknown type ${field.type}`
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          {fieldValue._form ? (
                            <IconButton
                              onClick={() =>
                                onChange({
                                  ...value,
                                  [fieldKey]: fieldValue._form || "",
                                })
                              }
                            >
                              <Icon icon="keyboard" />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                onChange({
                                  ...value,
                                  [fieldKey]: { _form: fieldValue },
                                })
                              }
                            >
                              <Icon icon="vials" />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}
          <TableRow>
            <TableCell colSpan={3}>
              <context.UI.Inputs.Select
                label="Add field"
                options={fieldOptions}
                onChange={(val) => {
                  onChange({
                    ...value,
                    [val as string]: { operator: "equals", value: "test" },
                  });
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </context.UI.Design.Card>
  );
};

export default ObjectDesigner;
