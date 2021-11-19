import { Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { AppContext } from "../../../../Components/Context";
import {
  DialogFieldType,
  LayoutItemType,
  ListItemType,
  ModelLayoutType,
  ModelType,
  SelectOptionType,
} from "../../../../Utils/Types";
import ModelLayoutComponents from "./Components";
import ModelLayoutFields from "./Fields";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import DropTarget from "./DropTarget";
import styles from "./styles.module.scss";
import { cloneDeep, isEqual, map } from "lodash";
import Icon from "../../../../Components/Design/Icon";
import { modifyRecursive } from "../../../../Utils/Functions";
import Actions from "../../../../Components/Actions/index";
import { useGlobal } from "reactn";

const ModelLayoutDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
  model: ModelType;
}> = ({
  context: {
    UI: {
      Design: { Animation, Card, Tabs },
    },
  },
  selectedKey,
  context,
  model,
}) => {
  // Vars
  const [layout, setLayout] = useState<ModelLayoutType>();
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [actionOptions, setActionOptions] = useState<SelectOptionType[]>([]);
  const [allFields, setAllFields] = useState<SelectOptionType[]>([]);
  const [titleFields, setTitleFields] = useState<SelectOptionType[]>([]);
  const [imageFields, setImageFields] = useState<SelectOptionType[]>([]);
  const [colorFields, setColorFields] = useState<SelectOptionType[]>([]);
  const [isMobile] = useGlobal<any>("isMobile");

  // Lifecycle
  useEffect(() => {
    setLayout(model.layouts[selectedKey]);
  }, [model, selectedKey]);
  // Compare the original layotu and the runtime layout for changes
  useEffect(() => {
    setHasChanged(!isEqual(model.layouts[selectedKey], layout));
  }, [model, selectedKey, layout]);
  useEffect(() => {
    // Processes
    context.data.objects.get(
      "process",
      {
        $or: [
          {
            "triggers.singleAction": {
              $elemMatch: { modelKey: model.key },
            },
          },
          {
            "triggers.globalAction": {
              $elemMatch: { modelKey: model.key },
            },
          },
        ],
      },
      (processes) => {
        const newActionOptions: SelectOptionType[] = [];
        // Actions from code
        map(Actions, (action, actionKey) => {
          if (
            action.accepts.includes("None") ||
            action.accepts.includes("One")
          ) {
            newActionOptions.push({
              label: action.label,
              value: actionKey,
            });
          }
        });
        processes.map((process) =>
          newActionOptions.push({
            label: process.name,
            value: `process_${process._id}`,
          })
        );
        setActionOptions(newActionOptions);
      }
    );
  }, [context.data.objects, model.key]);
  useEffect(() => {
    const newAllFields: SelectOptionType[] = [];
    const newTitleFields: SelectOptionType[] = [];
    const newColorFields: SelectOptionType[] = [];
    const newImageFields: SelectOptionType[] = [];
    map(model.fields, (field, fieldKey) => {
      const f = { label: field.label, value: fieldKey };
      newAllFields.push(f);
      (field.type === "text" ||
        field.type === "options" ||
        field.type === "relationship" ||
        field.type === "relationship_m") &&
        newTitleFields.push(f);
      field.type === "color" && newColorFields.push(f);
      field.type === "image" && newImageFields.push(f);
    });

    setAllFields(newAllFields);
    setTitleFields(newTitleFields);
    setColorFields(newColorFields);
    setImageFields(newImageFields);
  }, [model.fields]);

  // UI
  if (!layout) return <context.UI.Loading />;
  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <Animation.Container>
        <Grid container>
          <Grid
            item
            xs={12}
            md={9}
            className={!isMobile ? "scrollIndependently" : ""}
          >
            <Animation.Item key="details">
              <Card
                title="Facts"
                onExplanation={() =>
                  context.canvas.interact.dialog({
                    display: true,
                    title: "More info",
                    text: "The facts bar is meant for static information and the interactions of an object. It is not always shown. Up to 6 fields can be added and the fields cannot be edited. ",
                    size: "sm",
                  })
                }
              >
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <context.UI.Inputs.Select
                      label="Title"
                      value={layout.factsbar?.title}
                      options={titleFields}
                      clearable
                      onChange={(newValue) => {
                        setLayout({
                          ...layout,
                          factsbar: {
                            ...layout.factsbar,
                            title: newValue as string | undefined,
                          },
                        });
                      }}
                    />
                    {colorFields.length > 0 && (
                      <context.UI.Inputs.Select
                        label="Color"
                        value={layout.factsbar?.color}
                        options={colorFields}
                        onChange={(newValue) => {
                          setLayout({
                            ...layout,
                            factsbar: {
                              ...layout.factsbar,
                              color: newValue as string,
                            },
                          });
                        }}
                      />
                    )}
                    {imageFields.length > 0 && (
                      <context.UI.Inputs.Select
                        label="Image"
                        value={layout.factsbar?.image}
                        options={imageFields}
                        onChange={(newValue) => {
                          setLayout({
                            ...layout,
                            factsbar: {
                              ...layout.factsbar,
                              image: newValue as string,
                            },
                          });
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <context.UI.Inputs.Select
                      label="Displayed fields"
                      value={layout.factsbar?.fields || []}
                      options={context.utils.listifyObjectForSelect(
                        model.fields,
                        "label"
                      )}
                      multi
                      onChange={(newVal) =>
                        setLayout({
                          ...layout,
                          factsbar: {
                            ...(layout.factsbar || {}),
                            fields: newVal as string[],
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <context.UI.Inputs.Select
                      label="Actions"
                      value={layout.buttons || []}
                      options={actionOptions}
                      multi
                      onChange={(newVal) =>
                        setLayout({
                          ...layout,
                          buttons: newVal as string[],
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Card>
            </Animation.Item>
            <Animation.Item key="layout">
              <Card title="Layout">
                <DropTarget
                  id="root"
                  layout={layout.layout}
                  setLayout={(newLayout) =>
                    setLayout({ ...layout, layout: newLayout })
                  }
                >
                  {layout.layout?.map((layoutItem, index) => (
                    <LayoutItem
                      layoutItem={layoutItem}
                      key={index}
                      layout={layout.layout}
                      setLayout={(newLayout) =>
                        setLayout({ ...layout, layout: newLayout })
                      }
                      context={context}
                      model={model}
                    />
                  ))}
                </DropTarget>
              </Card>
            </Animation.Item>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            className={!isMobile ? "scrollIndependently" : ""}
          >
            {hasChanged && (
              <Animation.Item key="savebutton">
                <Button
                  color="primary"
                  variant="outlined"
                  fullWidth
                  style={{
                    margin: "0px 15px",
                    color: "white",
                    border: "1px solid white",
                  }}
                  onClick={() => {
                    const newModel = {
                      ...model,
                      layouts: {
                        ...model.layouts,
                        [selectedKey]: layout,
                      },
                    };
                    context.data.models.update(newModel);
                  }}
                >
                  Save
                </Button>
              </Animation.Item>
            )}
            <Animation.Item key="components">
              <Card withoutPadding>
                <Tabs
                  baseUrl={`/settings/models/${model.key_plural}/layouts/${selectedKey}`}
                  tabs={[
                    {
                      label: "Components",
                      key: "components",
                      component: (
                        <ModelLayoutComponents
                          context={context}
                          model={model}
                        />
                      ),
                    },
                    {
                      label: "Fields",
                      key: "fields",
                      component: (
                        <ModelLayoutFields context={context} model={model} />
                      ),
                    },
                  ]}
                />
              </Card>
            </Animation.Item>
          </Grid>
        </Grid>
      </Animation.Container>
    </DndProvider>
  );
};

export default ModelLayoutDetail;

// Component for field selection (RelatedItemType)
const SelectFieldComponent: React.FC<{
  context: AppContext;
  model: ModelType;
  onChange: (arg: string[] | string) => void;
  value: string[];
  field: string;
  multi?: true;
}> = ({ context, model, onChange, value, field, multi }) => {
  // Vars
  const [targetModel, setTargetModel] = useState<ModelType>();

  // Lifecycle
  useEffect(() => {
    context.data.models.get(
      model.fields[field].relationshipTo!,
      (fetchedModel) => setTargetModel(fetchedModel)
    );
  }, [model, field, context.data.models]);

  // UI
  if (!targetModel) return <context.UI.Loading />;
  return (
    <context.UI.Inputs.Select
      label="Fields"
      multi={multi}
      options={context.utils.listifyObjectForSelect(
        targetModel.fields,
        "label"
      )}
      value={value || []}
      onChange={(value) =>
        multi ? onChange(value as string[]) : onChange(value as string)
      }
    />
  );
};

const hasDropZone = [
  "GridContainer",
  "GridItem",
  "AnimationContainer",
  "AnimationItem",
  "Animation",
  "Card",
];

const typeProperties: () => {
  [key: string]: { [key: string]: DialogFieldType };
} = () => {
  return {
    GridItem: {
      xs: {
        label: "Extra small",
        type: "number",
        width: 4,
        valueModifier: (value) => (value > 0 ? (value < 13 ? value : 12) : 1),
      },
      sm: {
        label: "Small",
        type: "number",
        width: 4,
        valueModifier: (value) => (value > 0 ? (value < 13 ? value : 12) : 1),
      },
      md: {
        label: "Medium",
        type: "number",
        width: 4,
        valueModifier: (value) => (value > 0 ? (value < 13 ? value : 12) : 1),
      },
      lg: {
        label: "Large",
        type: "number",
        width: 4,
        valueModifier: (value) => (value > 0 ? (value < 13 ? value : 12) : 1),
      },
      xl: {
        label: "Extra large",
        type: "number",
        width: 4,
        valueModifier: (value) => (value > 0 ? (value < 13 ? value : 12) : 1),
      },
    },
  };
};

const wrappers: { [key: string]: React.FC<{ layoutItem: LayoutItemType }> } = {
  GridContainer: ({ children }) => (
    <Grid container style={{ width: "100%" }}>
      {children}
    </Grid>
  ),
  GridItem: ({ children, layoutItem }) => (
    <Grid
      item
      style={{ overflow: "hidden" }}
      xs={layoutItem.args?.xs}
      sm={layoutItem.args?.sm}
      md={layoutItem.args?.md}
      lg={layoutItem.args?.lg}
      xl={layoutItem.args?.xl}
    >
      {children}
    </Grid>
  ),
};

const LayoutItem: React.FC<{
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  context: AppContext;
  model: ModelType;
}> = ({ layoutItem, layout, setLayout, context, model }) => {
  // Vars
  const Wrapper = // Outer wrapper for everything that has a wrapper
    layoutItem.type !== "GridContainer"
      ? wrappers[layoutItem.type] || EmptyWrapper
      : EmptyWrapper;
  const SubWrapper =
    layoutItem.type === "GridContainer" ? wrappers.GridContainer : EmptyWrapper; // SubWrapper is only for GridContainer (it's a flexbox and can't have unrelated DOM children)
  // Lifecycle
  // UI
  return (
    <Wrapper layoutItem={layoutItem}>
      <div className={styles.layoutItem}>
        {hasDropZone.includes(layoutItem.type) ? (
          <>
            <div className={styles.layoutItemHeader}>
              <div style={{ float: "right" }} className={styles.deleteIcon}>
                <Tooltip title={`Delete ${layoutItem.label}`} placement="left">
                  <IconButton
                    onClick={async () => {
                      const newLayout = cloneDeep(layout);
                      await modifyRecursive(
                        newLayout,
                        layoutItem.key!,
                        (item) => {
                          return { pooP: true };
                        }
                      ).then((bl) => {
                        console.log(newLayout, bl);
                      });
                    }}
                  >
                    <Icon icon="trash" size={14} />
                  </IconButton>
                </Tooltip>
              </div>
              <Typography
                variant="h6"
                style={{ fontSize: 18, textAlign: "center" }}
              >
                {typeProperties()[layoutItem.type] && (
                  <IconButton
                    onClick={() =>
                      context.canvas.interact.dialog({
                        display: true,
                        title: "Properties",
                        fields: typeProperties()[layoutItem.type],
                        actionValues: layoutItem.args,
                        actions: [
                          {
                            label: "Update",
                            onClick: async (form, close) => {
                              // Update the item
                              const newLayout = cloneDeep(layout);

                              modifyRecursive(
                                newLayout,
                                layoutItem.key!,
                                (item) => {
                                  const newItem = item;
                                  newItem!.args = {
                                    ...(item!.args || {}),
                                    ...form,
                                  };
                                  return newItem;
                                }
                              );
                              setLayout(newLayout);
                              close();
                            },
                          },
                        ],
                      })
                    }
                  >
                    <Icon icon="wrench" size={16} />
                  </IconButton>
                )}
                {layoutItem.label}
              </Typography>
            </div>
            <DropTarget
              id={layoutItem.key!}
              layout={layout}
              setLayout={setLayout}
            >
              <SubWrapper layoutItem={layoutItem}>
                {(layoutItem.items || []).map((layoutItem, index) => (
                  <LayoutItem
                    layoutItem={layoutItem}
                    key={index}
                    layout={layout}
                    setLayout={setLayout}
                    context={context}
                    model={model}
                  />
                ))}
              </SubWrapper>
            </DropTarget>
          </>
        ) : layoutItem.type === "RelatedItem" ? (
          <Typography variant="body1">
            <Icon icon="address-card" style={{ marginRight: 10 }} />
            <IconButton
              onClick={() =>
                context.canvas.interact.dialog({
                  display: true,
                  title: "Properties",
                  fields: {
                    fields: {
                      label: "Fields",
                      type: "custom",
                      component: SelectFieldComponent,
                      componentProps: {
                        model,
                        field: layoutItem.args?.field,
                        multi: true,
                      },
                    },
                  },
                  actionValues: layoutItem.args,
                  actions: [
                    {
                      label: "Update",
                      onClick: async (form, close) => {
                        // Update the item
                        const newLayout = cloneDeep(layout);

                        modifyRecursive(newLayout, layoutItem.key!, (item) => {
                          const newItem = item;
                          newItem!.args = {
                            ...(item!.args || {}),
                            ...form,
                          };
                          return newItem;
                        });
                        setLayout(newLayout);
                        close();
                      },
                    },
                  ],
                })
              }
            >
              <Icon icon="wrench" size={16} />
            </IconButton>
            {layoutItem.label}
          </Typography>
        ) : (
          <Typography variant="body1">
            <Icon icon="font" style={{ marginRight: 10 }} />
            {layoutItem.label}
          </Typography>
        )}
      </div>
    </Wrapper>
  );
};

const EmptyWrapper: React.FC = ({ children }) => <>{children}</>;
