import { useEffect, useState } from "react";
import { AppContext } from "../../../..";
import {
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
}> = ({ vars, layoutItem, context, baseUrl }) => {
  // Vars
  const [items, setItems] = useState<ListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    setItems(
      (vars[layoutItem.args?.listItems] || []).map((o: ObjectType) => {
        return { label: o.name, key: o._id };
      })
    );
  }, [layoutItem, vars]);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      items={items}
      detailComponent={DetailComponent}
      baseUrl={baseUrl}
    />
  );
};

export default InterfaceListDetailLayout;

const DetailComponent: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}> = ({ context, selectedKey, item }) => {
  return <>Detail component for {item.label}</>;
};
