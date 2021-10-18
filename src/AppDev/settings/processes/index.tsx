import React, { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import { ListItemType, ProcessObjectType } from "../../../Utils/Types";
import ProcessDetail from "./detail";

const SettingsProcesses: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars
  const [processes, setProcesses] = useState<ProcessObjectType[]>();
  const [processList, setProcessList] = useState<ListItemType[]>();

  // Lifecycle
  useEffect(() => {
    context.data.objects.get("processes", {}, (objects) => {
      setProcesses(objects as ProcessObjectType[]);
      setProcessList(context.utils.listify(objects, "name", "_id"));
    });
  }, []);

  // UI
  if (!processes || !processList) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      items={processList}
      context={context}
      title="Processes"
      baseUrl="/settings/processes"
      detailComponent={ProcessDetail}
      create={{
        onClick: () =>
          context.canvas.interact.dialog({
            display: true,
            title: "New process",
            size: "sm",
            fields: {
              name: { label: "Name", linkToKeyField: "key" },
              key: { label: "Key", type: "key" },
            },
            actions: [
              {
                label: "Create",
                onClick: (form, close) =>
                  context.data.objects
                    .create("process", {
                      name: form.name,
                      key: form.key,
                      logic: [
                        {
                          id: "input",
                          type: "input",
                          selectable: false,
                          data: { label: "Start" },
                          position: { x: 255, y: 15 },
                        },
                        {
                          id: "output",
                          type: "output",
                          selectable: false,
                          data: { label: "Done" },
                          position: { x: 255, y: 700 },
                        },
                      ],
                    })
                    .then(
                      () => close(),
                      (reason) => {
                        context.canvas.interact.snackbar(reason, "error");
                        close();
                      }
                    ),
              },
            ],
          }),
      }}
    />
  );
};

export default SettingsProcesses;
