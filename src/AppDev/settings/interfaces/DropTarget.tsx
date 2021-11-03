import { FC } from "react";
import { DropTargetMonitor } from "react-dnd";
import { DropTarget, DropTargetConnector } from "react-dnd";
import { LayoutItemType } from "../../../Utils/Types";
import styles from "./styles.module.scss";
import { useDrop } from "react-dnd";
import uniqid from "uniqid";
import { cloneDeep } from "lodash";
import { modifyRecursive } from "../../../Utils/Functions";

const Target: FC<{
  id: string;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
}> = ({ children, id, layout, setLayout }) => {
  const [{ isOverCurrent }, drop] = useDrop(
    () => ({
      accept: "component",
      async drop(item: unknown, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }

        const newLayoutItem: LayoutItemType = {
          //@ts-ignore
          ...monitor.getItem().layoutItem,
          key: uniqid(),
        };

        if (id === "root") {
          setLayout([...(layout || []), newLayoutItem]);
        } else {
          const newLayout = cloneDeep(layout);
          modifyRecursive(newLayout, id, (item) => {
            const newItems = item!.items || [];
            newItems.push(newLayoutItem);
            item!.items = newItems;
            return item;
          });
          setLayout(newLayout);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [id, layout]
  );

  return (
    <div
      ref={drop}
      role={id}
      className={`${styles.dropTarget} ${isOverCurrent && styles.hovered}`}
    >
      {children}
      <div style={{ textAlign: "center" }}>
        {isOverCurrent ? "Drop here" : "Components go here"}
      </div>
    </div>
  );
};

export default DropTarget(
  "target",
  {
    drop: () => ({ name: "Target" }),
  },
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)(Target);
