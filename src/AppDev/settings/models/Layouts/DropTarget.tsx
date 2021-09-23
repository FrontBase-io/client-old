import { FC, useState } from "react";
import { DropTargetMonitor } from "react-dnd";
import { DropTarget, DropTargetConnector } from "react-dnd";
import { LayoutItemType } from "../../../../Utils/Types";
import styles from "./styles.module.scss";
import { useDrop } from "react-dnd";
import uniqid from "uniqid";
import { cloneDeep } from "lodash";

const Dustbin: FC<{
  id: string;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
}> = ({ children, id, layout, setLayout }) => {
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);

  const [{ isOver, isOverCurrent }, drop] = useDrop(
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
          setLayout([...layout, newLayoutItem]);
          setHasDropped(false);
        } else {
          const newLayout = cloneDeep(layout);
          addItemRecursive(newLayout, id, newLayoutItem);
          setLayout(newLayout);
        }
        setHasDropped(true);
        setHasDroppedOnChild(didDrop);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [setHasDropped, setHasDroppedOnChild, id, layout]
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
    drop: () => ({ name: "Dustbin" }),
  },
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)(Dustbin);

const addItemRecursive = (
  array: { [key: string]: any }[],
  key: string,
  newItem: {}
) =>
  new Promise<void>((resolve, reject) => {
    // eslint-disable-next-line array-callback-return
    (array || []).map(function (item): void {
      if (item.key === key) {
        const newItems = item.items || [];
        newItems.push(newItem);
        item.items = newItems;
        resolve();
      } else {
        addItemRecursive(item.items, key, newItem);
      }
    });
  });
