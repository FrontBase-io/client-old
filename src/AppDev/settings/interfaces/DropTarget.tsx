import { FC } from "react";
import { DropTargetMonitor } from "react-dnd";
import { DropTarget, DropTargetConnector } from "react-dnd";
import { LayoutItemType } from "../../../Utils/Types";
import styles from "./styles.module.scss";
import { useDrop } from "react-dnd";
import uniqid from "uniqid";
import { cloneDeep } from "lodash";
import { modifyRecursive } from "../../../Utils/Functions";
import Icon from "../../../Components/Design/Icon";

const Target: FC<{
  id: string;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  dropHint?: string;
  accepts?: string[];
  mini?: true;
  single?: true;
  onDrop?: (dropped: any) => void;
}> = ({
  children,
  id,
  layout,
  setLayout,
  dropHint,
  accepts,
  mini,
  single,
  onDrop,
}) => {
  const [{ isOverCurrent }, drop] = useDrop(
    () => ({
      accept: "component",
      async drop(item: unknown, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }

        //This line checks if the received objects is accepted
        // @ts-ignore
        if (!accepts || accepts?.includes(monitor.getItem().layoutItem.type)) {
          const newLayoutItem: LayoutItemType = {
            //@ts-ignore
            ...monitor.getItem().layoutItem,
            key: uniqid(),
          };
          if (onDrop) {
            onDrop(newLayoutItem);
          } else {
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
          }
        } else {
          console.log(
            `This zone doesn't accept ${
              //@ts-ignore
              monitor?.getItem().layoutItem.type
            }. Only ${accepts.join(", ")} accepted.`
          );
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
    <>
      {children}
      {(!single || children === undefined) && (
        <div
          ref={drop}
          role={id}
          className={`${styles.dropTarget} ${isOverCurrent && styles.hovered}`}
        >
          {mini ? (
            <Icon icon="people-carry" size={16} />
          ) : isOverCurrent ? (
            "Drop here"
          ) : (
            dropHint || "Drop components here"
          )}
        </div>
      )}
    </>
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
