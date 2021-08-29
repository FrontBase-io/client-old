import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, { useState, useEffect } from "react";
import { AppContext } from "../../../../Components/Context";
import TextInput from "../../../../Components/Inputs/Text";
import {
  ListItemType,
  ModelFieldType,
  ModelType,
} from "../../../../Utils/Types";

const ModelFieldDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}> = ({ context, selectedKey, item }) => {
  // Vars
  const [field, setField] = useState<ModelFieldType>();

  // Lifecycle
  useEffect(() => {
    setField(item.object);
  }, [selectedKey]);

  // UI
  return (
    <context.UI.Design.Animation.Container>
      <Grid container>
        <Grid item xs={12}>
          <context.UI.Design.Animation.Item key="Field">
            <context.UI.Design.Card title="Field">
              <Grid container>
                <Grid item xs={6}>
                  <TextInput
                    label="Label"
                    value={field?.label || ""}
                    onChange={(label) => setField({ ...field, label })}
                  />
                </Grid>
                <Grid item xs={6}>
                  Key: {item.key}
                </Grid>
              </Grid>
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={12}>
          <context.UI.Design.Animation.Item key="Data">
            <context.UI.Design.Card title="Data">Test</context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={6}>
          <context.UI.Design.Animation.Item key="Validations">
            <context.UI.Design.Card title="Validations">
              Test
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
