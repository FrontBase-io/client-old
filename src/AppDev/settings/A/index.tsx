import React, { useEffect } from "react";
import { AppContext } from "../../../Components/Context";

const A: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars

  // Lifecycle
  useEffect(() => {
    context.canvas.name.set("Page AAAAAA");
    return () => {
      context.canvas.name.set();
    };
  }, []);

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title="AAAAAAAA">AAAAAAAA</context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default A;
