import { IconButton, Popover, Tooltip } from "@mui/material";
import { cloneDeep, find } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
  SelectOptionType,
} from "../../../../Utils/Types";

const ComponentPreviewObjectLayout: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelList: ModelType[];
}> = ({ context, layoutItem, layout, setLayout, variables, modelList }) => {
  // Vars
  const [modelOptions, setModelOptions] = useState<SelectOptionType[]>([]);
  const [layoutOptions, setLayoutOptions] = useState<SelectOptionType[]>([]);
  const [settingsAnchor, setSettingsAnchor] =
    useState<HTMLButtonElement | null>();

  // Lifecycle
  useEffect(() => {
    setModelOptions(
      context.utils.listifyForSelect(modelList, "label_plural", "key")
    );
  }, [context.utils, modelList]);
  useEffect(() => {
    if (layoutItem.args?.model) {
      const model = find(
        modelList,
        (o: ModelType) => o.key === layoutItem.args?.model
      ) as ModelType;
      setLayoutOptions(
        context.utils.listifyObjectForSelect(model?.layouts, "label")
      );
    }
  }, [context.utils, layoutItem.args?.model, modelList, modelOptions]);

  // UI
  return (
    <>
      <Popover
        id="settings-popover"
        open={Boolean(settingsAnchor)}
        anchorEl={settingsAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => setSettingsAnchor(null)}
      >
        <div style={{ margin: 10 }}>
          <context.UI.Inputs.Select
            label="Model"
            value={layoutItem.args?.model || ""}
            options={modelOptions}
            onChange={(model) => {
              const newLayout = cloneDeep(layout);
              modifyRecursive(newLayout, layoutItem.key!, (item) => {
                const newItem = item;
                newItem!.args = {
                  ...(item!.args || {}),
                  model,
                };
                return newItem;
              });
              setLayout(newLayout);
            }}
          />
          {layoutItem.args?.model && (
            <>
              <context.UI.Inputs.Select
                label="Layouts"
                value={layoutItem.args?.layouts || []}
                options={layoutOptions}
                multi
                onChange={(layouts) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(newLayout, layoutItem.key!, (item) => {
                    const newItem = item;
                    newItem!.args = {
                      ...(item!.args || {}),
                      layouts,
                    };
                    return newItem;
                  });
                  setLayout(newLayout);
                }}
              />
              <context.UI.Inputs.Text
                label="Object ID"
                value={layoutItem.args?.objectId || []}
                onChange={(objectId) => {
                  const newLayout = cloneDeep(layout);
                  modifyRecursive(newLayout, layoutItem.key!, (item) => {
                    const newItem = item;
                    newItem!.args = {
                      ...(item!.args || {}),
                      objectId,
                    };
                    return newItem;
                  });
                  setLayout(newLayout);
                }}
              />
              {!layoutItem.args?.objectId && (
                <context.UI.Objects.Designer
                  title="New object defaults"
                  context={context}
                  mode="create"
                  model={find(
                    modelList,
                    (o) => o.key === layoutItem.args?.model
                  )}
                  withFormula
                  value={layoutItem.args?.defaults || {}}
                  onChange={(defaults) => {
                    const newLayout = cloneDeep(layout);
                    modifyRecursive(newLayout, layoutItem.key!, (item) => {
                      const newItem = item;
                      newItem!.args = {
                        ...(item!.args || {}),
                        defaults,
                      };
                      return newItem;
                    });
                    setLayout(newLayout);
                  }}
                />
              )}
            </>
          )}
        </div>
      </Popover>
      <context.UI.Design.Card
        title="Layout"
        titleSecondary={
          <Tooltip
            placement="bottom"
            title={
              Boolean(settingsAnchor)
                ? "Close layout settings"
                : "Edit layout settings"
            }
          >
            <IconButton onClick={(e) => setSettingsAnchor(e.currentTarget)}>
              <context.UI.Design.Icon
                icon={Boolean(settingsAnchor) ? "times-circle" : "wrench"}
                size={18}
              />
            </IconButton>
          </Tooltip>
        }
      >
        Lay-out
      </context.UI.Design.Card>
    </>
  );
};

export default ComponentPreviewObjectLayout;
