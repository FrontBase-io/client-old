import { FC, useState } from "react";
import { DropTargetMonitor } from "react-dnd";
import { DropTarget, DropTargetConnector } from "react-dnd";
import { LayoutItemType } from "../../../../Utils/Types";
import styles from "./styles.module.scss";
import { useDrop } from "react-dnd";
import uniqid from "uniqid";

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
      drop(item: unknown, monitor) {
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
          //@ts-ignore
          setLayout([...addItemRecursive(layout, id, newLayoutItem)]);
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
) => {
  (array || []).map((item) => {
    if (item.key === key) {
      const newItems = item.items || [];
      newItems.push(newItem);
      item.items = newItems;
    } else {
      addItemRecursive(item.items, key, newItem);
    }
  });

  return array;
};
