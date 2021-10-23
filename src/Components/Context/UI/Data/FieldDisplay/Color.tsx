import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";
import styles from "./Color.module.scss";

const DisplayColor: React.FC<{
  model: ModelType;
  object?: ObjectType;
  fieldKey: string;
  context: AppContext;
}> = ({ model, object, fieldKey, context }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <div
      style={{
        border: "1px solid black",
        cursor: "pointer",
        backgroundColor: `rgb(${object![fieldKey].r},${object![fieldKey].g},${
          object![fieldKey].b
        })`,
      }}
      className={styles.colorPreview}
    />
  );
};

export default DisplayColor;
