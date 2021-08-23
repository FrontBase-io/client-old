import React, { useEffect } from "react";
import { AppContext } from "../../Components/Context";
import Icon from "../../Components/Design/Icon";
import { AppPageType } from "../../Utils/Types";

const Model: React.FC<{ context: AppContext; page: AppPageType }> = ({
  context,
  page,
}) => {
  // Vars

  // Lifecycle
  useEffect(() => {
    context.canvas.up.set({ url: "/settings" });
    context.canvas.name.set(page.label);
    return () => {
      context.canvas.up.set(undefined);
      context.canvas.name.set();
    };
  }, [page]);

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title={page.label}>
        <context.UI.Layouts.ObjectOverview />
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default Model;
