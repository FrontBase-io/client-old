import { useEffect, useState } from "react";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
  LayoutItemType,
  ListItemType,
  ObjectType,
} from "../../../../../../Utils/Types";

const InterfaceListDetailLayout: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  variables: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVariables: (variables: {
    [key: string]: InterfaceobjectVariableType;
  }) => void;
}> = ({
  variables,
  layoutItem,
  context,
  baseUrl,
  interfaceObject,
  setVariables,
}) => {
  // Vars
  const [items, setItems] = useState<ListItemType[]>();

  // Lifecycle
  useEffect(() => {
    setItems(
      (variables[layoutItem.args?.listItems] || []).map((o: ObjectType) => {
        return { label: o[layoutItem.args?.labelField], key: o._id };
      })
    );
  }, [layoutItem, variables]);

  // UI
  if (!items) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      items={items}
      //@ts-ignore
      detailComponent={DetailComponent}
      baseUrl={baseUrl}
      detailComponentProps={{
        layoutItem,
        variables,
        baseUrl,
        interfaceObject,
        setVariables,
      }}
      title={layoutItem.args?.title}
    />
  );
};

export default InterfaceListDetailLayout;

const DetailComponent: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
  layoutItem: LayoutItemType;
  variables: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVariables: (variables: {
    [key: string]: InterfaceobjectVariableType;
  }) => void;
}> = ({
  context,
  selectedKey,
  item,
  layoutItem,
  variables,
  baseUrl,
  interfaceObject,
  setVariables,
}) => {
  return (
    <>
      {(layoutItem.items || []).map((childLayoutItem) => (
        <InterfaceLayoutItem
          context={context}
          layoutItem={childLayoutItem}
          layout={interfaceObject.layout!}
          variables={{
            ...variables,
            [`selected${
              layoutItem.args?.listItems.charAt(0).toUpperCase() +
              layoutItem.args?.listItems.slice(1)
            }Item`]: item,
            [`selected${
              layoutItem.args?.listItems.charAt(0).toUpperCase() +
              layoutItem.args?.listItems.slice(1)
            }Key`]: selectedKey,
          }}
          baseUrl={baseUrl}
          interfaceObject={interfaceObject}
          setVariables={setVariables}
        />
      ))}
    </>
  );
};
