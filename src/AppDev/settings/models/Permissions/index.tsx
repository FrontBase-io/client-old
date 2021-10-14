import { Button, Grid } from "@mui/material";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { ModelType, SelectOptionType } from "../../../../Utils/Types";

const ModelPermissions: React.FC<{
  context: AppContext;
  model: ModelType;
  updateModel: (updatedFields: {}) => void;
}> = ({ context, model, updateModel }) => {
  // Vars
  const [newModel, setNewModel] = useState<ModelType>();
  const [permissionList, setPermissionList] = useState<SelectOptionType[]>();
  const explain = (title: string, text: string) =>
    context.canvas.interact.dialog({
      display: true,
      title,
      text,
      size: "xs",
    });

  // Lifecycle
  useEffect(() => {
    setNewModel(model);
    context.data.objects.get("permissions", {}, (fetchedPermissions) => {
      setPermissionList(
        context.utils.listifyForSelect(fetchedPermissions, "name", "name")
      );
    });
  }, [context.data.objects, context.utils, model]);

  // UI
  if (!newModel || !permissionList) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Container>
      <Grid container>
        <Grid item xs={3}>
          <context.UI.Design.Animation.Item key="permission-read">
            <context.UI.Design.Card
              title="Read"
              onExplanation={() =>
                explain(
                  "Read permission",
                  "This permissions allows the bearer to view ALL objects belonging to this model."
                )
              }
            >
              <context.UI.Inputs.Select
                label="Read permissions"
                value={newModel.permissions.read}
                options={permissionList}
                multi
                onChange={(newPermissions) =>
                  setNewModel({
                    ...newModel,
                    permissions: {
                      ...newModel.permissions,
                      read:
                        newPermissions.length === 0
                          ? ["nobody"]
                          : (newPermissions as string[]),
                    },
                  })
                }
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={3}>
          <context.UI.Design.Animation.Item key="permission-read-own">
            <context.UI.Design.Card
              title="Read (own)"
              onExplanation={() =>
                explain(
                  "Read (own) permission",
                  "This permission allows it's bearer to access the objects they created themselves. These permissions are preferential over the read permissions."
                )
              }
            >
              <context.UI.Inputs.Select
                label="Read (own) permissions"
                value={newModel.permissions.read_own}
                options={permissionList}
                multi
                onChange={(newPermissions) =>
                  setNewModel({
                    ...newModel,
                    permissions: {
                      ...newModel.permissions,
                      read_own:
                        newPermissions.length === 0
                          ? ["nobody"]
                          : (newPermissions as string[]),
                    },
                  })
                }
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={3}>
          <context.UI.Design.Animation.Item key="permission-create">
            <context.UI.Design.Card
              title="Create"
              onExplanation={() =>
                explain(
                  "Create permission",
                  "This permissions allows the bearer to create objects in this model"
                )
              }
            >
              <context.UI.Inputs.Select
                label="Create permissions"
                value={newModel.permissions.create}
                options={permissionList}
                multi
                onChange={(newPermissions) =>
                  setNewModel({
                    ...newModel,
                    permissions: {
                      ...newModel.permissions,
                      create:
                        newPermissions.length === 0
                          ? ["nobody"]
                          : (newPermissions as string[]),
                    },
                  })
                }
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={3}>
          <context.UI.Design.Animation.Item key="permission-update">
            <context.UI.Design.Card
              title="Update"
              onExplanation={() =>
                explain(
                  "Update permission",
                  "This permissions allows the bearer to update ALL objects."
                )
              }
            >
              <context.UI.Inputs.Select
                label="Update permissions"
                value={newModel.permissions.update}
                options={permissionList}
                multi
                onChange={(newPermissions) =>
                  setNewModel({
                    ...newModel,
                    permissions: {
                      ...newModel.permissions,
                      update:
                        newPermissions.length === 0
                          ? ["nobody"]
                          : (newPermissions as string[]),
                    },
                  })
                }
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={3}>
          <context.UI.Design.Animation.Item key="permission-update-own">
            <context.UI.Design.Card
              title="Update"
              onExplanation={() =>
                explain(
                  "Update (own) permission",
                  "This permissions allows the bearer to update objects within this model that they made themselves. These permissions are preferential over the update permissions."
                )
              }
            >
              <context.UI.Inputs.Select
                label="Update (own) permissions"
                value={newModel.permissions.update_own}
                options={permissionList}
                multi
                onChange={(newPermissions) =>
                  setNewModel({
                    ...newModel,
                    permissions: {
                      ...newModel.permissions,
                      update_own:
                        newPermissions.length === 0
                          ? ["nobody"]
                          : (newPermissions as string[]),
                    },
                  })
                }
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={3}>
          <context.UI.Design.Animation.Item key="permission-delete">
            <context.UI.Design.Card
              title="Delete"
              onExplanation={() =>
                explain(
                  "Delete permission",
                  "This permissions allows the bearer to delete ANY object belonging to this model."
                )
              }
            >
              <context.UI.Inputs.Select
                label="Delete permissions"
                value={newModel.permissions.delete}
                options={permissionList}
                multi
                onChange={(newPermissions) =>
                  setNewModel({
                    ...newModel,
                    permissions: {
                      ...newModel.permissions,
                      delete:
                        newPermissions.length === 0
                          ? ["nobody"]
                          : (newPermissions as string[]),
                    },
                  })
                }
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={3}>
          <context.UI.Design.Animation.Item key="permission-delete-own">
            <context.UI.Design.Card
              title="Delete (own)"
              onExplanation={() =>
                explain(
                  "Delete (own) permission",
                  "This permissions allows the bearer to delete objects belonging to this model that they made themselves. These permissions are preferential over the delete permissions."
                )
              }
            >
              <context.UI.Inputs.Select
                label="Delete (own) permissions"
                value={newModel.permissions.delete_own}
                options={permissionList}
                multi
                onChange={(newPermissions) =>
                  setNewModel({
                    ...newModel,
                    permissions: {
                      ...newModel.permissions,
                      delete_own:
                        newPermissions.length === 0
                          ? ["nobody"]
                          : (newPermissions as string[]),
                    },
                  })
                }
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={12}>
          {!isEqual(model.permissions, newModel.permissions) && (
            <context.UI.Design.Animation.Item key="save">
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() =>
                  updateModel({ permissions: newModel.permissions })
                }
              >
                Update permissions
              </Button>
            </context.UI.Design.Animation.Item>
          )}
        </Grid>
      </Grid>
    </context.UI.Design.Animation.Container>
  );
};

export default ModelPermissions;
