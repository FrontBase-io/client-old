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
  return <>AAAAAAAAAAA</>;
};

export default A;
