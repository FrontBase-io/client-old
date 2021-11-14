import { map } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../..";
import { InterfaceObjectType } from "../../../../../Utils/Types";
import InterfaceLayoutItem from "./LayoutItems";

const RenderInterface: React.FC<{
  context: AppContext;
  interfaceObject?: InterfaceObjectType;
  interfaceObjectKey?: string;
  baseUrl: string;
}> = ({ context, interfaceObject, interfaceObjectKey, baseUrl }) => {
  // Vars
  const [variables, setVariables] = useState<{ [key: string]: any }>({});
  const [appliedInterfaceObject, setAppliedInterfaceObject] =
    useState<InterfaceObjectType>();

  // Lifecycle
  useEffect(() => {
    if (interfaceObject) {
      setAppliedInterfaceObject(interfaceObject);
    } else {
      context.data.objects.getOne(
        "interface",
        { key: interfaceObjectKey },
        (io) => setAppliedInterfaceObject(io as InterfaceObjectType)
      );
    }
  }, [context.data.objects, interfaceObject, interfaceObjectKey]);
  useEffect(() => {
    if (appliedInterfaceObject) {
      map(appliedInterfaceObject!.variables, (varInfo, varKey) => {
        if (!variables[varKey]) {
          context.data.objects.get(varInfo.model!, {}, (data) => {
            setVariables({ ...variables, [varKey]: data });
          });
        }
      });
    }
  }, [appliedInterfaceObject, context.data.objects, variables]);

  // UI
  if (!appliedInterfaceObject) return <context.UI.Loading />;
  return (
    <>
      {(appliedInterfaceObject.layout || []).map((layoutItem) => (
        <InterfaceLayoutItem
          context={context}
          layoutItem={layoutItem}
          layout={appliedInterfaceObject.layout!}
          variables={variables}
          baseUrl={baseUrl}
          interfaceObject={appliedInterfaceObject}
          setVariables={setVariables}
        />
      ))}
    </>
  );
};

export default RenderInterface;
