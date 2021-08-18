import React, { useEffect } from "react";
import { AppContext } from "../../../Components/Context";

const B: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars

  // Lifecycle
  useEffect(() => {
    context.canvas.up.set({ title: "up", url: "/test" });
    context.canvas.name.set("Page B");
    return () => {
      context.canvas.up.set(undefined);
      context.canvas.name.set();
    };
  }, []);

  // UI
  return <>BBBBBBBBBBBB</>;
};

export default B;
