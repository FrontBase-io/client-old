import React, { useEffect, useState } from "react";
import { AppContext } from "../../Components/Context";
import { AppPageType, ModelType, ObjectType } from "../../Utils/Types";

const ModelDetail: React.FC<{ context: AppContext; page: AppPageType }> = ({
  context,
  page,
}) => {
  // Vars

  // Lifecycle
  useEffect(() => {
    context.canvas.name.set(page.label);
    return () => {
      context.canvas.name.set();
    };
  }, [page]);

  // UI
  return (
    <context.UI.Layouts.ObjectList modelKey={page.key} context={context} />
  );
};

export default ModelDetail;
