import React, { useEffect, useState } from "react";
import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";

const ObjectList: React.FC<{ context: AppContext; modelKey: string }> = ({
  modelKey,
  context: {
    data,
    UI: { Loading },
  },
}) => {
  // Vars
  const [model, setModel] = useState<ModelType>();
  const [objects, setObjects] = useState<ObjectType[]>();

  // Lifecycle
  useEffect(() => {
    data.models.get(modelKey, (model: ModelType) => setModel(model));
  }, [modelKey]);

  // UI
  if (!model) return <Loading />;
  return <>{model.label}</>;
};

export default ObjectList;
