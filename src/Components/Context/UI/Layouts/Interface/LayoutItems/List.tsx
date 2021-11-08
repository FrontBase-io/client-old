import { List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  LayoutItemType,
  ListItemType,
  ObjectType,
} from "../../../../../../Utils/Types";
//@ts-ignore
import Formula from "frontbase-formulas";

const filterListItems = (
  vars: { [key: string]: any },
  itemKey: string,
  layoutItem: LayoutItemType
) =>
  new Promise<ListItemType[]>(async (resolve, reject) => {
    if (layoutItem.args?.filter) {
      const filterSteps: { value: any; key: string }[] = [];
      // First parse the formula so we know what values we expect
      await Object.keys(layoutItem.args?.filter || {}).reduce(
        //@ts-ignore
        async (prevFilter, currFilter) => {
          await prevFilter;

          if (layoutItem.args?.filter[currFilter].value._form) {
            // Compile formula
            const formula = new Formula(
              layoutItem.args?.filter[currFilter].value._form
            );
            await formula.onParsed;
            filterSteps.push({
              value: await formula.parse(vars),
              key: currFilter,
            });
          } else {
            // Normal value
            filterSteps.push({
              value: layoutItem.args?.filter[currFilter].value,
              key: currFilter,
            });
          }

          return currFilter;
        },
        Object.keys(layoutItem.args?.filter || {})[0]
      );

      // Now apply the filters
      const newList: ListItemType[] = [];
      vars[itemKey].map((o: ObjectType) => {
        let passedFilters = true;
        filterSteps.map((filter) => {
          if (o[filter.key] !== filter.value) {
            passedFilters = false;
          }
        });

        if (passedFilters)
          newList.push({ label: o[layoutItem.args?.labelField], key: o._id });
      });
      resolve(newList);
    } else {
      resolve(
        vars[itemKey].map((o: ObjectType) => {
          return {
            label: o[layoutItem.args?.labelField],
            key: o._id,
          };
        })
      );
    }
  });

const InterfaceList: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject }) => {
  // Vars
  const [items, setItems] = useState<ListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    filterListItems(vars, layoutItem.args?.listItems, layoutItem).then(
      (newItems) => {
        setItems(newItems);
      }
    );
  }, [layoutItem, vars]);

  // UI

  return (
    <context.UI.Design.Animation.Container>
      <List>
        {items.map((item) => (
          <context.UI.Design.Animation.Item key={item.key}>
            <ListItem>
              <ListItemText>{item.label}</ListItemText>
            </ListItem>
          </context.UI.Design.Animation.Item>
        ))}
      </List>
    </context.UI.Design.Animation.Container>
  );
};

export default InterfaceList;