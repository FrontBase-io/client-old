import React, { useEffect } from "react";
import { AppContext } from "../../../Components/Context";

const B: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars

  // Lifecycle
  useEffect(() => {
    context.canvas.navbar.up("/settings");
    context.canvas.navbar.name("Page B");
    return () => {
      context.canvas.navbar.up(undefined);
      context.canvas.navbar.name();
    };
  }, [context.canvas.navbar]);

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title="BBBBBBBBBBB">
        BBBBBBBBBBB
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default B;
