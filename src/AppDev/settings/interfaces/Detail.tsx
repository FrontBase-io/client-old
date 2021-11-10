import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import FourOhFour from "../../../Components/FourOhFour";
import {
  InterfaceObjectType,
  ListItemType,
  ModelType,
} from "../../../Utils/Types";
import DropTarget from "./DropTarget";
import InterfaceVariables from "./Variables";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
} from "react-dnd-multi-backend";
import InterfaceComponents from "./Components";
import LayoutItemComponent from "./LayoutItemComponents";
import { map } from "lodash";

const InterfaceDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}> = ({ context, item }) => {
  // Vars
  const [interfaceObject, setInterfaceObject] = useState<InterfaceObjectType>();
  const [modelList, setModelList] = useState<ModelType[]>();

  // Lifecycle
  useEffect(() => {
    item && setInterfaceObject(item.object);
  }, [item]);
  useEffect(() => {
    context.data.models.getAll((ms) => setModelList(ms));
  }, []);

  // UI
  if (!interfaceObject || !modelList) return <context.UI.Loading />;
  return (
    <DndProvider
      options={{
        backends: [
          {
            id: "html5",
            //@ts-ignore
            backend: HTML5Backend,
            transition: MouseTransition,
          },
          {
            id: "touch",
            //@ts-ignore
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition,
          },
        ],
      }}
    >
      <context.UI.Design.Animation.Container>
        <Grid container>
          <Grid item xs={12} md={8} className="scrollIndependently">
            <context.UI.Design.Animation.Item key="left">
              <context.UI.Design.Card>
                <DropTarget
                  id="root"
                  layout={interfaceObject.layout || []}
                  setLayout={(layout) =>
                    setInterfaceObject({ ...interfaceObject, layout })
                  }
                  dropHint="Drop top level components here"
                >
                  {(interfaceObject.layout || []).map(
                    (layoutItem, layoutItemIndex) => (
                      <LayoutItemComponent
                        layoutItem={layoutItem}
                        context={context}
                        key={`layoutItem-${layoutItemIndex}`}
                        layout={interfaceObject.layout || []}
                        setLayout={(layout) =>
                          setInterfaceObject({ ...interfaceObject, layout })
                        }
                        variables={interfaceObject.variables || {}}
                        modelList={modelList}
                      />
                    )
                  )}
                </DropTarget>
              </context.UI.Design.Card>
            </context.UI.Design.Animation.Item>
          </Grid>
          <Grid item xs={12} md={4} className="scrollIndependently">
            {JSON.stringify(interfaceObject) !==
              JSON.stringify(item.object) && (
              <context.UI.Design.Animation.Item key="save">
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    color: "white",
                    margin: 10,
                    marginBottom: 0,
                    width: "calc(100% - 20px)",
                  }}
                  onClick={() => {
                    const fieldsToUpdate: { [key: string]: any } = {};
                    map(interfaceObject, (value, key) => {
                      if (
                        JSON.stringify(value) !==
                        JSON.stringify(item.object[key])
                      ) {
                        fieldsToUpdate[key] = value;
                      }
                    });

                    context.data.objects.update(
                      interfaceObject._id,
                      fieldsToUpdate
                    );
                  }}
                >
                  Save
                </Button>
              </context.UI.Design.Animation.Item>
            )}
            <context.UI.Design.Animation.Item key="preview">
              <Button
                variant="contained"
                fullWidth
                style={{
                  color: "white",
                  margin: 10,
                  marginBottom: 0,
                  width: "calc(100% - 20px)",
                }}
                onClick={() =>
                  context.canvas.interact.dialog({
                    display: true,
                    title: `${interfaceObject.name} preview`,
                    withoutPadding: true,
                    content: () => (
                      <context.UI.Layouts.Interface
                        context={context}
                        interfaceObject={interfaceObject}
                        baseUrl={`/settings/interfaces/${interfaceObject.key}`}
                      />
                    ),
                  })
                }
              >
                Preview
              </Button>
            </context.UI.Design.Animation.Item>
            <context.UI.Design.Animation.Item key="right">
              <context.UI.Design.Card withoutPadding>
                <context.UI.Design.Tabs
                  tabs={[
                    {
                      label: "Variables",
                      key: "variables",
                      component: (
                        <InterfaceVariables
                          context={context}
                          interfaceObject={interfaceObject}
                          onChange={(newV) =>
                            setInterfaceObject({
                              ...interfaceObject,
                              variables: newV,
                            })
                          }
                        />
                      ),
                    },

                    {
                      label: "Actions",
                      key: "actions",
                      component: <FourOhFour />,
                    },

                    {
                      label: "Components",
                      key: "components",
                      component: <InterfaceComponents context={context} />,
                    },
                  ]}
                />
              </context.UI.Design.Card>
            </context.UI.Design.Animation.Item>
          </Grid>
        </Grid>
      </context.UI.Design.Animation.Container>
    </DndProvider>
  );
};

export default InterfaceDetail;
