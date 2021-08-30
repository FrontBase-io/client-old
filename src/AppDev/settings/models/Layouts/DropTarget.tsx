import { FC, useState } from "react";
import { ConnectDropTarget, DropTargetMonitor } from "react-dnd";
import { DropTarget, DropTargetConnector } from "react-dnd";
import { LayoutItemType } from "../../../../Utils/Types";
import styles from "./styles.module.scss";
import { useDrop } from "react-dnd";
import { useEffect } from "react";
import { updateByKey } from "../../../../Components/Context/Utils";
import uniqid from "uniqid";

function getObject(array: any, value: any) {
  var o;
  array.some(function iter(a: any) {
    if (a["key"] === value) {
      o = a;
      return true;
    }
    return Array.isArray(a.children) && a.children.some(iter);
  });
  return o;
}

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
          let newObject: LayoutItemType = getObject(layout, id);
          newObject.items = newObject.items || [];
          newObject.items.push(newLayoutItem);
          const newLayout = layout!;
          //@ts-ignore
          updateByKey(newLayout, newObject);
          setLayout([...newLayout]);
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
      className={styles.dropTarget}
      style={{ backgroundColor: isOverCurrent ? "#111" : "#232323" }}
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
