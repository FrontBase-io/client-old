import React, { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import { SystemTaskObjectType } from "../../../Utils/Types";

const SettingsUpdate: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars
  const [updateTask, setUpdateTask] = useState<SystemTaskObjectType>();

  // Lifecycle
  useEffect(() => {}, []);

  // UI
  if (!updateTask) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title="Update">Update</context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default SettingsUpdate;
