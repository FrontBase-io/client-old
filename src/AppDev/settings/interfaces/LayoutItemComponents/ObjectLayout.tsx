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
  // Lifecycle
  useEffect(() => {
    setModelOptions(
      context.utils.listifyForSelect(modelList, "label_plural", "key")
    );
  }, [modelList]);
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
  }, [context.utils, layoutItem.args?.model, modelOptions]);

  // UI
  console.log(layoutOptions);

  return (
    <context.UI.Design.Card title="Layout">
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
          />{" "}
          <context.UI.Objects.Designer
            title="Add defaults"
            context={context}
            model={find(modelList, (o) => o.key === layoutItem.args?.model)}
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
        </>
      )}
    </context.UI.Design.Card>
  );
};

export default ComponentPreviewObjectLayout;
