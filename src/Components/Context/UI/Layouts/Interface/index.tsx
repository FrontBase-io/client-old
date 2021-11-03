import { map } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../..";
import { InterfaceObjectType } from "../../../../../Utils/Types";
import InterfaceLayoutItem from "./LayoutItems";

const RenderInterface: React.FC<{
  context: AppContext;
  interfaceObject: InterfaceObjectType;
  baseUrl: string;
}> = ({ context, interfaceObject, baseUrl }) => {
  // Vars
  const [vars, setVars] = useState<{ [key: string]: any }>({});

  // Lifecycle
  useEffect(() => {
    map(interfaceObject.variables, (varInfo, varKey) => {
      if (!vars[varKey]) {
        context.data.objects.get(varInfo.model!, {}, (data) => {
          setVars({ ...vars, [varKey]: data });
        });
      }
    });
  }, [interfaceObject, vars]);

  // UI

  return (
    <>
      {(interfaceObject.layout || []).map((layoutItem) => (
        <InterfaceLayoutItem
          context={context}
          layoutItem={layoutItem}
          layout={interfaceObject.layout!}
          vars={vars}
          baseUrl={baseUrl}
        />
      ))}
    </>
  );
};

export default RenderInterface;
