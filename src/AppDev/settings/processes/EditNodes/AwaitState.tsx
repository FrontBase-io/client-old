import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import {
  ModelType,
  ProcessObjectType,
  SelectOptionType,
} from "../../../../Utils/Types";

const EditAwaitStateNode: React.FC<{
  value: { toUpdate: string[] };
  onChange: (newVal: {}) => void;
  process: ProcessObjectType;
  context: AppContext;
  models: ModelType[];
}> = ({ value, onChange, process, context, models }) => {
  // Vars
  const [modelList, setModelList] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    setModelList(
      models.map((o) => {
        return { label: o.label, value: o.key, object: o };
      })
    );
  }, [models]);

  // UI
  return (
    <>
      <context.UI.Inputs.Select label="Model" options={modelList} />
    </>
  );
};

export default EditAwaitStateNode;
