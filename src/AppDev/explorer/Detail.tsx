import React, { useEffect, useState } from "react";
import { AppContext } from "../../Components/Context";
import { AppPageType, ModelType } from "../../Utils/Types";
import find from "lodash/find";
import ObjectDetail from "./ObjectDetail";

const ModelDetail: React.FC<{
  context: AppContext;
  page: AppPageType;
  selectedPageKey: string;
}> = ({ context, page, selectedPageKey }) => {
  // Vars
  const [model, setModel] = useState<ModelType>();

  // Lifecycle
  useEffect(() => {
    setModel(
      find(
        page.props!.models,
        (o: ModelType) => o.key === page.key || o.key_plural === page.key
      )
    );

    context.canvas.navbar.name(page.label);
    return () => {
      context.canvas.navbar.name();
    };
  }, [context.canvas.navbar, page]);

  // UI
  if (!model) return <context.UI.Loading />;
  return selectedPageKey === model.key_plural ? (
    <context.UI.Layouts.ObjectList
      modelKey={page.key}
      model={model}
      context={context}
      baseUrl="/explorer"
    />
  ) : (
    <ObjectDetail context={context} model={model} />
  );
};

export default ModelDetail;
