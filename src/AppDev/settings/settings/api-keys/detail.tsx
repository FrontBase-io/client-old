import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DisplayRelationship from "../../../../Components/Context/UI/Data/FieldDisplay/Relationship";
import {
  ListDetailType,
  ModelType,
  PermissionObjectType,
} from "../../../../Utils/Types";

const SettingsApiKeyDetail: React.FC<ListDetailType> = ({ context, item }) => {
  // Vars
  const [permission, setPermission] = useState<PermissionObjectType>();

  // Lifecycle
  useEffect(() => {
    context.data.objects.getOne(
      "permission",
      { name: `api-${item.key}` },
      //@ts-ignore
      (p: PermissionObjectType) => setPermission(p)
    );
  }, [item.key]);

  // UI
  if (!permission) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title={item.label}>
        <Typography>
          {item.object.apiKey.substring(0, 4)}************************
          {item.object.apiKey.substring(30, 34)}
        </Typography>
        <Link to={`/o/${permission._id}`}>
          <Typography color="primary">
            View permission {permission.name}
          </Typography>
        </Link>
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default SettingsApiKeyDetail;
