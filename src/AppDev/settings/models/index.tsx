import React, { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import { ModelType } from "../../../Utils/Types";
import ModelDetail from "./Detail";

const PageModels: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars
  const [models, setModels] = useState<ModelType[]>();

  // Lifecycle
  useEffect(() => {
    context.canvas.name.set("Models");

    // Get data
    context.data.models.getAll((response) => {
      setModels(response);
    });
    return () => {
      context.canvas.name.set();
    };
  }, []);

  // UI
  if (!models) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      title="Models"
      menu={context.utils.listify(models, "label_plural", "key_plural", "icon")}
      baseUrl="/settings/models"
      detailComponent={ModelDetail}
    />
  );
};

export default PageModels;
