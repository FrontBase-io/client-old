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

const createParentHierarchy = (
  data: [],
  parentField: string,
  labelField: string,
  parentValue?: string
) => {
  const newItems: ListItemType[] = [];
  data.map((o: ObjectType) => {
    if (
      (parentValue && o[parentField] === parentValue) || // Matches the given parent value
      (!parentValue && !o[parentField]) // Has no parent value (root element)
    ) {
      const children = createParentHierarchy(
        data,
        parentField,
        labelField,
        o._id
      );
      newItems.push({
        label: o[labelField],
        key: o._id,
        object: o,
        items: children !== [] ? children : undefined,
      });
    }
  });
  return newItems;
};

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
    if (layoutItem.args?.parentField) {
      setItems(
        createParentHierarchy(
          variables[layoutItem.args?.listItems] || [],
          layoutItem.args?.parentField,
          layoutItem.args?.labelField
        )
      );
    } else {
      // No parent field, render everything
      setItems(
        (variables[layoutItem.args?.listItems] || []).map((o: ObjectType) => {
          return {
            label: o[layoutItem.args?.labelField],
            key: o._id,
            object: o,
          };
        })
      );
    }
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
  layoutItem: LayoutItemType;
  variables: { [key: string]: any };
  baseUrl: string;
  item: ListItemType;
  interfaceObject: InterfaceObjectType;
  setVariables: (variables: {
    [key: string]: InterfaceobjectVariableType;
  }) => void;
}> = ({
  context,
  selectedKey,
  layoutItem,
  variables,
  baseUrl,
  interfaceObject,
  setVariables,
  item,
}) => {
  // Vars

  // Lifecycle
  // UI
  if (!item) return <context.UI.Loading />;
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
          baseUrl={`${baseUrl}/${selectedKey}`}
          interfaceObject={interfaceObject}
          setVariables={setVariables}
        />
      ))}
    </>
  );
};
