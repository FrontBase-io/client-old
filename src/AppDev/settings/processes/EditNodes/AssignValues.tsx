import {
  Button,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { map, findLast } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import Icon from "../../../../Components/Design/Icon";
import {
  ModelType,
  ProcessObjectType,
  SelectOptionType,
} from "../../../../Utils/Types";

const EditAssignValuesNode: React.FC<{
  value: { [key: string]: {} };
  onChange: (newVal: { [key: string]: {} }) => void;
  process: ProcessObjectType;
  context: AppContext;
  models: ModelType[];
}> = ({ value, onChange, process, context, models }) => {
  // Vars
  const [options, setOptions] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    const newOptions: SelectOptionType[] = [];
    map(process.variables || {}, (v, k) => {
      if (!Object.keys(value).includes(k)) {
        newOptions.push({ label: v.label, value: k });
      }
    });
    setOptions(newOptions);
  }, [process, value]);
  // UI
  return (
    <Grid container spacing={1}>
      {map(value, (variableValue, variableKey) => {
        const v = (process.variables || {})[variableKey] || {
          label: "Unknown variable",
        };

        return (
          <Grid item xs={12} key={variableKey}>
            {v.type === "object" ? (
              <AssignValuesToObject
                context={context}
                process={process}
                value={variableValue}
                varKey={variableKey}
                model={
                  findLast(
                    models,
                    (o: ModelType) => o.key === v.recordModel
                  ) as ModelType
                }
                onChange={(newVal) =>
                  onChange({ ...(value || {}), [variableKey]: newVal })
                }
              />
            ) : v.type === "objects" ? (
              <AssignValuesToObject
                context={context}
                process={process}
                value={variableValue}
                varKey={variableKey}
                model={
                  findLast(
                    models,
                    (o: ModelType) => o.key === v.recordModel
                  ) as ModelType
                }
                onChange={(newVal) =>
                  onChange({ ...(value || {}), [variableKey]: newVal })
                }
              />
            ) : (
              <Grid container>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">{v.label}</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ fontWeight: "lighter" }}
                  >
                    {v.type}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  Equals
                </Grid>
                <Grid item xs={6}>
                  Set value to
                </Grid>
              </Grid>
            )}
          </Grid>
        );
      })}
      <Divider />
      {options.length > 0 && (
        <Grid item xs={12}>
          <Typography>Click the buttons to assign a variable</Typography>
          {options.map((v) => (
            <Button
              key={v.value}
              onClick={() => onChange({ ...value, [v.value]: {} })}
              color="primary"
              variant="outlined"
            >
              {v.label}
            </Button>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default EditAssignValuesNode;

const AssignValuesToObject: React.FC<{
  context: AppContext;
  process: ProcessObjectType;
  value: { [key: string]: any };
  model: ModelType;
  onChange: (newVal: {}) => void;
  varKey: string;
}> = ({ context, process, value, model, onChange, varKey }) => {
  // Vars
  const [options, setOptions] = useState<SelectOptionType[]>([]);
  const v = (process.variables || {})[varKey];

  // Lifecycle
  useEffect(() => {
    const newOptions: SelectOptionType[] = [];
    map(model.fields || {}, (v, k) => {
      if (!Object.keys(value).includes(k)) {
        newOptions.push({ label: model.fields[k].label, value: k });
      }
    });
    setOptions(newOptions);
  }, [context.utils, model, process.variables, value]);

  // UI
  return (
    <>
      <context.UI.Design.Card
        title={v.label}
        withoutMargin
        style={{ marginTop: 15 }}
      >
        <Table>
          <TableHead>
            <TableCell>Field</TableCell>
            <TableCell>Value</TableCell>
            <TableCell />
          </TableHead>
          <TableBody>
            {map(value, (fieldValue, optionKey) => {
              const field = model.fields[optionKey];

              return (
                <TableRow key={optionKey}>
                  <TableCell>{field.label}</TableCell>
                  <TableCell>
                    <Grid container>
                      <Grid item xs={11}>
                        {(fieldValue || {})["___form"] ? (
                          <context.UI.Inputs.Text
                            value={fieldValue["___form"]}
                            onChange={(newValue) =>
                              onChange({
                                ...value,
                                [optionKey]: { ___form: newValue },
                              })
                            }
                          />
                        ) : field.type === "text" ? (
                          <context.UI.Inputs.Text
                            value={fieldValue}
                            onChange={(newValue) =>
                              onChange({ ...value, [optionKey]: newValue })
                            }
                          />
                        ) : field.type === "number" ? (
                          <context.UI.Inputs.Number
                            value={fieldValue}
                            onChange={(newValue) =>
                              onChange({ ...value, [optionKey]: newValue })
                            }
                          />
                        ) : (
                          <>Unknown field type {field.type}</>
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        {(fieldValue || {})["___form"] ? (
                          <Tooltip
                            title="Switch back to value"
                            placement="right"
                          >
                            <IconButton
                              onClick={() => {
                                onChange({
                                  ...value,
                                  [optionKey]: fieldValue["___form"],
                                });
                              }}
                            >
                              <Icon icon="keyboard" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Switch to formula" placement="right">
                            <IconButton
                              onClick={() => {
                                onChange({
                                  ...value,
                                  [optionKey]: { ___form: value[optionKey] },
                                });
                              }}
                            >
                              <Icon icon="vial" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        const nv: { [key: string]: any } = value;
                        delete nv[optionKey];
                        onChange(nv);
                      }}
                    >
                      <Icon icon="trash" size={14} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <Divider />
          <context.UI.Inputs.Select
            options={options}
            label="Assign field"
            value=""
            onChange={(newField) =>
              onChange({ ...value, [newField as string]: undefined })
            }
          />
        </Table>
      </context.UI.Design.Card>
    </>
  );
};
