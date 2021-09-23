import {
  Button,
  Grid,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { AppContext } from "../../../../Components/Context";
import {
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
import { isEqual } from "lodash";

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

const LayoutItem: React.FC<{
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
}> = ({ layoutItem, layout, setLayout }) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <div className={styles.layoutItem}>
      {hasDropZone.includes(layoutItem.type) ? (
        <>
          <Typography variant="h6" style={{ fontSize: 18 }}>
            {layoutItem.label}: {layoutItem.key}
          </Typography>
          <DropTarget
            id={layoutItem.key!}
            layout={layout}
            setLayout={setLayout}
          >
            {(layoutItem.items || []).map((layoutItem, index) => (
              <LayoutItem
                layoutItem={layoutItem}
                key={index}
                layout={layout}
                setLayout={setLayout}
              />
            ))}
          </DropTarget>
        </>
      ) : (
        <Typography variant="body1">
          {layoutItem.type}: {layoutItem.label}: {layoutItem.key}
        </Typography>
      )}
    </div>
  );
};
