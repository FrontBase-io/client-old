import { useEffect, useState } from "react";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  LayoutItemType,
  ListItemType,
  ObjectType,
} from "../../../../../../Utils/Types";

const InterfaceListDetailLayout: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject }) => {
  // Vars
  const [items, setItems] = useState<ListItemType[]>();

  // Lifecycle
  useEffect(() => {
    setItems(
      (vars[layoutItem.args?.listItems] || []).map((o: ObjectType) => {
        return { label: o[layoutItem.args?.labelField], key: o._id };
      })
    );
  }, [layoutItem, vars]);

  // UI
  if (!items) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      items={items}
      //@ts-ignore
      detailComponent={DetailComponent}
      baseUrl={baseUrl}
      detailComponentProps={{ layoutItem, vars, baseUrl, interfaceObject }}
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
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
}> = ({
  context,
  selectedKey,
  item,
  layoutItem,
  vars,
  baseUrl,
  interfaceObject,
}) => {
  return (
    <>
      {(layoutItem.items || []).map((childLayoutItem) => (
        <InterfaceLayoutItem
          context={context}
          layoutItem={childLayoutItem}
          layout={interfaceObject.layout!}
          vars={{
            ...vars,
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
        />
      ))}
    </>
  );
};
