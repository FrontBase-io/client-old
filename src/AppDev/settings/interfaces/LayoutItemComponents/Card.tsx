import { Collapse, Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { modifyRecursive } from "../../../../Utils/Functions";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
  SelectOptionType,
} from "../../../../Utils/Types";
import DropTarget from "../DropTarget";
import LayoutItemComponent from "./index";

const ComponentPreviewCard: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelList: ModelType[];
  modelListOptions: SelectOptionType[];
}> = ({
  context,
  layoutItem,
  layout,
  setLayout,
  variables,
  modelList,
  modelListOptions,
}) => {
  // Vars
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Lifecycle

  // UI
  return (
    <context.UI.Design.Card
      title={layoutItem.args?.label._form || layoutItem.args?.label}
      withoutMargin={layoutItem.args?.withoutMargin}
      withoutPadding={layoutItem.args?.withoutPadding}
      withHorizontalOverflow
      titleSecondary={
        <Tooltip
          placement="bottom"
          title={settingsOpen ? "Close card settings" : "Edit card settings"}
        >
          <IconButton onClick={() => setSettingsOpen(!settingsOpen)}>
            <context.UI.Design.Icon
              icon={settingsOpen ? "times-circle" : "wrench"}
              size={18}
            />
          </IconButton>
        </Tooltip>
      }
    >
      <div style={{ minWidth: 350 }}>
        <Collapse in={settingsOpen} style={{ paddingBottom: 15 }}>
          <Divider />
          <div style={{ padding: 15 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={11}>
                    {layoutItem.args?.label._form ? (
                      <context.UI.Inputs.Text
                        label="Label formula"
                        value={layoutItem.args?.label._form}
                        onChange={async (label) => {
                          const newLayout = cloneDeep(layout);
                          modifyRecursive(
                            newLayout,
                            layoutItem.key!,
                            (item) => {
                              const newItem = item;
                              newItem!.args = {
                                ...(item!.args || {}),
                                label: { _form: label },
                              };
                              return newItem;
                            }
                          );
                          setLayout(newLayout);
                        }}
                      />
                    ) : (
                      <context.UI.Inputs.Text
                        label="Label"
                        value={layoutItem.args?.label}
                        onChange={async (label) => {
                          const newLayout = cloneDeep(layout);
                          modifyRecursive(
                            newLayout,
                            layoutItem.key!,
                            (item) => {
                              const newItem = item;
                              newItem!.args = {
                                ...(item!.args || {}),
                                label,
                              };
                              return newItem;
                            }
                          );
                          setLayout(newLayout);
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      onClick={async () => {
                        const newLayout = cloneDeep(layout);
                        modifyRecursive(newLayout, layoutItem.key!, (item) => {
                          const newItem = item;
                          newItem!.args = {
                            ...(item!.args || {}),
                            label: layoutItem.args?.label._form
                              ? layoutItem.args?.label._form || ""
                              : { _form: layoutItem.args?.label || "" },
                          };
                          return newItem;
                        });
                        setLayout(newLayout);
                      }}
                    >
                      <context.UI.Design.Icon
                        icon={layoutItem.args?.label._form ? "font" : "vials"}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <context.UI.Inputs.Boolean
                  label="Without padding"
                  value={layoutItem.args?.withoutPadding}
                  onChange={async (withoutPadding) => {
                    const newLayout = cloneDeep(layout);
                    modifyRecursive(newLayout, layoutItem.key!, (item) => {
                      const newItem = item;
                      newItem!.args = {
                        ...(item!.args || {}),
                        withoutPadding,
                      };
                      return newItem;
                    });
                    setLayout(newLayout);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <context.UI.Inputs.Boolean
                  label="Without margin"
                  value={layoutItem.args?.withoutMargin}
                  onChange={async (withoutMargin) => {
                    const newLayout = cloneDeep(layout);
                    modifyRecursive(newLayout, layoutItem.key!, (item) => {
                      const newItem = item;
                      newItem!.args = {
                        ...(item!.args || {}),
                        withoutMargin,
                      };
                      return newItem;
                    });
                    setLayout(newLayout);
                  }}
                />
              </Grid>
            </Grid>
          </div>
          <Divider />
        </Collapse>
        <DropTarget
          id={layoutItem.key!}
          layout={layout}
          setLayout={setLayout}
          dropHint={layoutItem.items ? "More Card Content" : "Card Content"}
        >
          {(layoutItem.items || []).map((subLayoutItem, layoutItemIndex) => (
            <LayoutItemComponent
              layoutItem={subLayoutItem}
              context={context}
              key={`layoutItem-${layoutItemIndex}`}
              layout={layout || []}
              setLayout={setLayout}
              modelList={modelList}
              variables={variables}
              modelListOptions={modelListOptions}
            />
          ))}
        </DropTarget>
      </div>
    </context.UI.Design.Card>
  );
};

export default ComponentPreviewCard;
