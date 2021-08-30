import { Button, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { AppContext } from "../../../../Components/Context";
import Icon from "../../../../Components/Design/Icon";
import { ModelType } from "../../../../Utils/Types";

const ModelGeneral: React.FC<{
  context: AppContext;
  model: ModelType;
  updateModel: (updatedFields: {}) => void;
}> = ({ context, model, updateModel }) => {
  // Vars
  const [newModel, setNewModel] = useState<ModelType>(model);

  // Lifecycle

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title="General" withoutMargin style={{ top: 15 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <context.UI.Inputs.Text
              label="Label"
              value={newModel.label}
              onChange={(label) => setNewModel({ ...newModel, label })}
            />
          </Grid>
          <Grid item xs={6}>
            <context.UI.Inputs.Text
              label="Label (plural)"
              value={newModel.label_plural}
              onChange={(label_plural) =>
                setNewModel({ ...newModel, label_plural })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <context.UI.Inputs.Text
              label="App"
              value={newModel.app}
              onChange={(app) => setNewModel({ ...newModel, app })}
            />
          </Grid>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={1}>
                <Icon icon={newModel.icon} style={{ padding: "20px 5px" }} />
              </Grid>
              <Grid item xs={11}>
                <context.UI.Inputs.Text
                  label="Icon"
                  value={newModel.icon}
                  onChange={(icon) => setNewModel({ ...newModel, icon })}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <context.UI.Inputs.Select
              label="Primary field"
              value={newModel.primary}
              onChange={(primary) =>
                setNewModel({ ...newModel, primary: primary as string })
              }
              options={context.utils.listifyObjectForSelect(
                model.fields,
                "label"
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              fullWidth
              onClick={() => {
                updateModel(newModel);
              }}
              variant="contained"
              disabled={JSON.stringify(model) === JSON.stringify(newModel)}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default ModelGeneral;
