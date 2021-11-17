import { ListDetailType } from "../../../Utils/Types";
import SettingsApiKeys from "./api-keys";

const SettingsDetail: React.FC<ListDetailType> = ({ context, item }) => {
  return item.key === "api-keys" ? (
    <SettingsApiKeys context={context} item={item} />
  ) : (
    <>Unknown page</>
  );
};

export default SettingsDetail;
