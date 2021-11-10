import React, { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import { ListItemType } from "../../../Utils/Types";
import InterfaceDetail from "./Detail";

const PageInterfaces: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars

  const [interfaceList, setInterfaceList] = useState<ListItemType[]>([]);
  // Lifecycle
  useEffect(() => {
    context.data.objects.get("interface", {}, (interfaces) => {
      setInterfaceList(
        interfaces.map((i) => {
          return {
            label: i.name,
            key: i.key,
            secondary: i.description,
            object: i,
          };
        })
      );
    });
  }, []);

  // UI
  if (!interfaceList) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      title="Interfaces"
      items={interfaceList}
      baseUrl="/settings/interfaces"
      detailComponent={InterfaceDetail}
      navWidth={2}
      create={{
        label: "New UI",
        onClick: () =>
          context.canvas.interact.dialog({
            display: true,
            title: "New interface",
            fields: {
              name: { label: "Name", linkToKeyField: "key", width: 6 },
              key: { label: "Key", type: "key", width: 6 },
              description: { label: "Description" },
            },
            actions: [
              {
                label: "Create",
                onClick: (form, close) => {
                  context.data.objects
                    .create("interface", {
                      name: form.name,
                      key: form.key,
                      description: form.description,
                    })
                    .then(() => close());
                },
              },
            ],
          }),
      }}
    />
  );
};

export default PageInterfaces;
