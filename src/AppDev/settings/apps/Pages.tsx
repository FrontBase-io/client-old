import {
  Button,
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import Icon from "../../../Components/Design/Icon";
import { AppObjectType, SelectOptionType } from "../../../Utils/Types";

const TabPages: React.FC<{ context: AppContext; app: AppObjectType }> = ({
  context,
  app,
}) => {
  // Vars
  const [newApp, setNewApp] = useState<AppObjectType>();
  const [expandedPage, setExpandedPage] = useState<string>();
  const [modelList, setModelList] = useState<SelectOptionType[]>([]);
  const [interfaceList, setInterfaceList] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    context.data.models.getAll((models) =>
      setModelList(
        context.utils.listifyForSelect(models, "label_plural", "key")
      )
    );

    context.data.objects.get("interface", {}, (interfaces) => {
      setInterfaceList(
        context.utils.listifyForSelect(interfaces, "name", "key")
      );
    });
  }, [context.data.models, context.data.objects, context.utils]);
  useEffect(() => {
    setNewApp(cloneDeep(app));
  }, [app]);

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={6}>
          <context.UI.Design.Card title="Pages" withoutPadding>
            {JSON.stringify(app) !== JSON.stringify(newApp) && (
              <Button
                fullWidth
                style={{ margin: 15, marginTop: 0, width: "calc(100% - 30px)" }}
                onClick={() => {
                  context.data.objects.update(newApp!._id, newApp!);
                }}
                variant="contained"
              >
                Save
              </Button>
            )}
            <List disablePadding>
              {(newApp?.pages || []).map((page, pageIndex) => (
                <>
                  <ListItem
                    key={page.key}
                    button
                    onClick={() =>
                      setExpandedPage(expandedPage !== page.key ? page.key : "")
                    }
                  >
                    <ListItemIcon style={{ minWidth: 32 }}>
                      <Icon icon={page.icon} />
                    </ListItemIcon>
                    <ListItemText style={{ marginLeft: 12 }}>
                      {page.label}
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Icon
                        icon={
                          expandedPage === page.key
                            ? "chevron-up"
                            : "chevron-down"
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Collapse
                    in={expandedPage === page.key}
                    timeout="auto"
                    unmountOnExit
                    style={{ padding: 15 }}
                  >
                    <context.UI.Inputs.Text
                      label="Label"
                      value={page.label}
                      onChange={(newLabel) => {
                        const pages = newApp!.pages;
                        pages![pageIndex].label = newLabel;
                        setNewApp({
                          ...newApp!,
                          pages,
                        });
                      }}
                    />
                    <context.UI.Inputs.Text
                      label="Key"
                      value={page.key}
                      onChange={(key) => {
                        const pages = newApp!.pages;
                        pages![pageIndex].key = key;
                        setNewApp({
                          ...newApp!,
                          pages,
                        });
                      }}
                    />
                    <context.UI.Inputs.Text
                      label="Icon"
                      value={page.icon}
                      onChange={(icon) => {
                        const pages = newApp!.pages;
                        pages![pageIndex].icon = icon;
                        setNewApp({
                          ...newApp!,
                          pages,
                        });
                      }}
                    />
                    <context.UI.Inputs.Select
                      label="Type"
                      value={page.content.type || "model"}
                      options={[
                        { label: "Model", value: "model" },
                        { label: "Interface", value: "interface" },
                      ]}
                      onChange={(type) => {
                        const pages = newApp!.pages;
                        pages[pageIndex].content = {
                          ...(pages[pageIndex].content || {}),
                          type: type as "model" | "interface",
                        };
                        setNewApp({
                          ...newApp!,
                          pages,
                        });
                      }}
                    />
                    {(page.content.type || "model") === "model" && (
                      <context.UI.Inputs.Select
                        label="Model"
                        value={page.content.model}
                        options={modelList}
                        onChange={(modelKey) => {
                          const pages = newApp!.pages;
                          pages[pageIndex].content = {
                            ...(pages[pageIndex].content || {}),
                            model: modelKey as string,
                          };
                          setNewApp({
                            ...newApp!,
                            pages,
                          });
                        }}
                      />
                    )}
                    {(page.content.type || "model") === "interface" && (
                      <context.UI.Inputs.Select
                        label="Interface"
                        value={page.content.interfaceKey}
                        options={interfaceList}
                        onChange={(interfaceKey) => {
                          const pages = newApp!.pages;
                          pages[pageIndex].content = {
                            ...(pages[pageIndex].content || {}),
                            interfaceKey: interfaceKey as string,
                          };
                          setNewApp({
                            ...newApp!,
                            pages,
                          });
                        }}
                      />
                    )}
                  </Collapse>
                </>
              ))}
              <Divider />
              <ListItem
                button
                onClick={() =>
                  setNewApp({
                    ...newApp!,
                    pages: [
                      ...(newApp?.pages || []),
                      {
                        label: "New page",
                        key: "new",
                        icon: "vial",
                        content: { type: "model", model: "app" },
                      },
                    ],
                  })
                }
              >
                <ListItemText>Create</ListItemText>
              </ListItem>
            </List>
          </context.UI.Design.Card>
        </Grid>
      </Grid>
    </context.UI.Design.Animation.Animate>
  );
};

export default TabPages;
