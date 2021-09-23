import {
  Button,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { AppContext } from "../../../../Components/Context";
import {
  DialogActionType,
  DialogFieldType,
  LayoutItemType,
  ListItemType,
  ModelType,
} from "../../../../Utils/Types";
import ModelLayoutComponents from "./Components";
import ModelLayoutFields from "./Fields";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
} from "react-dnd-multi-backend";
import DropTarget from "./DropTarget";
import styles from "./styles.module.scss";
import { cloneDeep, isEqual } from "lodash";
import Icon from "../../../../Components/Design/Icon";
import { modifyRecursive } from "../../../../Utils/Functions";

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
  const [layout, setLayout] = useState<LayoutItemType[]>([]);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  // Lifecycle
  useEffect(() => {
    setLayout([...(model.layouts[selectedKey].layout || [])]);
  }, [model, selectedKey]);
  // Compare the original layotu and the runtime layout for changes
  useEffect(() => {
    setHasChanged(!isEqual(model.layouts[selectedKey].layout, layout));
  }, [model, selectedKey, layout]);

  // UI
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
      <Animation.Container>
        <Grid container>
          <Grid item xs={8}>
            <Animation.Item key="details">
              <Card title="Details">Facts bar</Card>
            </Animation.Item>
            <Animation.Item key="layout">
              <Card title="Layout">
                <DropTarget id="root" layout={layout} setLayout={setLayout}>
                  {layout.map((layoutItem, index) => (
                    <LayoutItem
                      layoutItem={layoutItem}
                      key={index}
                      layout={layout}
                      setLayout={setLayout}
                      context={context}
                    />
                  ))}
                </DropTarget>
              </Card>
            </Animation.Item>
          </Grid>
          <Grid item xs={4}>
            {hasChanged && (
              <Animation.Item key="savebutton">
                <Button
                  color="primary"
                  variant="outlined"
                  fullWidth
                  style={{ margin: "0px 15px", color: "white" }}
                  onClick={() => {
                    const newModel = {
                      ...model,
                      layouts: {
                        [selectedKey]: {
                          ...model.layouts[selectedKey],
                          layout,
                        },
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

const hasDropZone = [
  "GridContainer",
  "GridItem",
  "AnimationContainer",
  "AnimationItem",
  "Animation",
  "Card",
];

const typeProperties: {
  [key: string]: { [key: string]: DialogFieldType };
} = {
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
      sm={layoutItem.args?.xs}
      md={layoutItem.args?.xs}
      lg={layoutItem.args?.xs}
      xl={layoutItem.args?.xs}
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
}> = ({ layoutItem, layout, setLayout, context }) => {
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
            <Typography
              variant="h6"
              style={{ fontSize: 18, textAlign: "center" }}
            >
              {typeProperties[layoutItem.type] && (
                <IconButton
                  onClick={() =>
                    context.canvas.interact.dialog({
                      display: true,
                      title: "Properties",
                      fields: typeProperties[layoutItem.type],
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
                                newItem.args = {
                                  ...(item.args || {}),
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
                  />
                ))}
              </SubWrapper>
            </DropTarget>
          </>
        ) : (
          <Typography variant="body1">
            {layoutItem.type}: {layoutItem.label}: {layoutItem.key}
          </Typography>
        )}
      </div>
    </Wrapper>
  );
};

const EmptyWrapper: React.FC = ({ children }) => <>{children}</>;
