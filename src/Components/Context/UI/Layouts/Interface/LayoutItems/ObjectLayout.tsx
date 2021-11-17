import { useEffect, useState } from "react";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  LayoutItemType,
} from "../../../../../../Utils/Types";
//@ts-ignore
import Formula from "frontbase-formulas";

const parseFormulas = (
  inputs: { [key: string]: { _form?: any } },
  variables: {}
) =>
  new Promise<{}>(async (resolve) => {
    const results = inputs;

    //@ts-ignore
    await Object.keys(inputs).reduce(async (prev, curr) => {
      await prev;

      if (inputs[curr]._form) {
        // Compile formula
        const formula = new Formula(inputs[curr]._form);
        await formula.onParsed;
        results[curr] = await formula.parse(variables);
      }

      return curr;
    }, Object.keys(inputs));

    resolve(results);
  });

const InterfaceObjectLayout: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  variables: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
}> = ({ variables, layoutItem, context, baseUrl, interfaceObject }) => {
  // Vars
  const [defaults, setDefaults] = useState<{} | undefined | null>();
  const [objectId, setObjectId] = useState<string | null>();

  // Lifecycle
  useEffect(() => {
    if (layoutItem.args?.defaults) {
      parseFormulas(layoutItem.args?.defaults, variables).then((result) =>
        setDefaults(result)
      );
    } else {
      setDefaults(null);
    }

    if (layoutItem.args?.objectId) {
      context.utils
        .parseFormula(layoutItem.args?.objectId, variables)
        .then((parsedFormula) => setObjectId(parsedFormula));
    } else {
      setObjectId(null);
    }
  }, [layoutItem, variables]);

  // UI
  if (defaults === undefined || objectId === undefined)
    return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ObjectDetail
      context={context}
      modelKey={layoutItem.args?.model}
      layoutKey={layoutItem.args?.layouts || ["default"]}
      style={{ height: "auto" }}
      defaults={defaults || {}}
      objectId={objectId!}
    />
  );
};

export default InterfaceObjectLayout;
