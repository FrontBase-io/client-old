import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import FourOhFour from "../../../Components/FourOhFour";
import { InterfaceObjectType, ListItemType } from "../../../Utils/Types";
import InterfaceVariables from "./Variables";

const InterfaceDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}> = ({ context, item }) => {
  // Vars
  const [interfaceObject, setInterfaceObject] = useState<InterfaceObjectType>();

  // Lifecycle
  useEffect(() => {
    item && setInterfaceObject(item.object);
  }, [item]);

  // UI
  if (!interfaceObject) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Container>
      <Grid container>
        <Grid item xs={12} md={8}>
          <context.UI.Design.Animation.Item key="left">
            <context.UI.Design.Card>
              {interfaceObject.name}
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
        <Grid item xs={12} md={4}>
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
                    component: <FourOhFour />,
                  },
                ]}
              />
            </context.UI.Design.Card>
          </context.UI.Design.Animation.Item>
        </Grid>
      </Grid>
    </context.UI.Design.Animation.Container>
  );
};

export default InterfaceDetail;
