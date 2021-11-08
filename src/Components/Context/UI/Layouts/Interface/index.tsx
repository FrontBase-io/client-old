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
  const [vars, setVars] = useState<{ [key: string]: any }>({});
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
        if (!vars[varKey]) {
          context.data.objects.get(varInfo.model!, {}, (data) => {
            setVars({ ...vars, [varKey]: data });
          });
        }
      });
    }
  }, [appliedInterfaceObject, context.data.objects, vars]);

  // UI
  if (!appliedInterfaceObject) return <context.UI.Loading />;
  return (
    <>
      {(appliedInterfaceObject.layout || []).map((layoutItem) => (
        <InterfaceLayoutItem
          context={context}
          layoutItem={layoutItem}
          layout={appliedInterfaceObject.layout!}
          vars={vars}
          baseUrl={baseUrl}
          interfaceObject={appliedInterfaceObject}
        />
      ))}
    </>
  );
};

export default RenderInterface;
